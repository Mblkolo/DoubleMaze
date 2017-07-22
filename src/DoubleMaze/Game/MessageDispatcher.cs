﻿using DoubleMaze.Game.Areas;
using DoubleMaze.Game.Bots;
using DoubleMaze.Game.Maze;
using DoubleMaze.Infrastructure;
using System;
using System.Collections.Generic;

namespace DoubleMaze.Game
{
    public class WorldState
    {
        public Dictionary<Guid, PlayerContex> Players = new Dictionary<Guid, PlayerContex>();
        public Dictionary<Guid, SimpleMaze> Games = new Dictionary<Guid, SimpleMaze>();
        public Guid? WaitPlayer;

        public Dictionary<Guid, PlayerStoreData> OldPlayers = new Dictionary<Guid, PlayerStoreData>();

        public Pipe<IMessage> InputQueue;

        public List<Bot> Bots = new List<Bot>();
        public HashSet<Guid> BotInGame = new HashSet<Guid>();
    }

    public class PlayerStoreData
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Rating Rating { get; set; }
    }

    public class PlayerContex
    {
        public Guid Id { get; }
        public PlayerType PlayerType { get; }

        public Pipe<IGameCommand> Output { get; set; }
        public IAreaHandler PlayerHandler { get; private set; }

        public string Name { get; set; }
        public Rating Rating { get; private set; }

        public PlayerContex(Guid id, Pipe<IGameCommand> output, PlayerType type)
            : this(id, output, new Rating())
        {
            PlayerType = type;
        }

        public PlayerContex(PlayerStoreData storeData, Pipe<IGameCommand> output)
            : this(storeData.Id, output, storeData.Rating)
        {
            Name = storeData.Name;
        }

        internal void ResetPlayer()
        {
            Rating = new Rating();
            Name = null;
        }

        private PlayerContex(Guid id, Pipe<IGameCommand> output, Rating rating)
        {
            Output = output;
            Id = id;
            Rating = rating;
        }


        public PlayerStoreData GetStoreData()
        {
            return new PlayerStoreData
            {
                Id = Id,
                Rating = Rating,
                Name = Name
            };
        }

        public void SetHandler(IAreaHandler handler)
        {
            if (PlayerHandler != null)
                PlayerHandler.PlayerLeft();

            PlayerHandler = handler;
            PlayerHandler.PlayerJoin();
        }
    }

    public class MessageDispatcher
    {
        //private BufferBlock<IMessage> inputQueue;
        private WorldState state;

        public MessageDispatcher(Pipe<IMessage> inputQueue)
        {
            state = new WorldState();
            state.InputQueue = inputQueue;

            state.Bots.Add(new Bot(inputQueue, 5));
            state.Bots.Add(new Bot(inputQueue, 9));
            state.Bots.Add(new Bot(inputQueue, 13));
            state.Bots.Add(new Bot(inputQueue, 17));
            state.Bots.Add(new Bot(inputQueue, 21));
        }

        public void Process(PlayerConnected connection)
        {
            if (state.OldPlayers.ContainsKey(connection.PlayerId))
            {
                var playerContext = new PlayerContex(state.OldPlayers[connection.PlayerId], connection.OutputQueue);
                state.OldPlayers.Remove(connection.PlayerId);
                state.Players.Add(connection.PlayerId, playerContext);

                playerContext.SetHandler(new ReturnAreaHandler(connection.PlayerId, state));
            }
            else if (state.Players.ContainsKey(connection.PlayerId))
            {
                state.Players[connection.PlayerId].Output = connection.OutputQueue;
                state.Players[connection.PlayerId].PlayerHandler.PlayerJoin();
            }
            else
            {
                var playerContext = new PlayerContex(connection.PlayerId, connection.OutputQueue, connection.PlayerType);
                state.Players.Add(connection.PlayerId, playerContext);

                IAreaHandler handler = playerContext.PlayerType == PlayerType.Bot
                    ? (IAreaHandler)new StasisAreaHandler(connection.PlayerId, state)
                    : new WelcomeAreaHandler(connection.PlayerId, state);

                playerContext.SetHandler(handler);
            }
        }

        public void Process(PlayerDisconnected disconnected)
        {
            if (state.Players.ContainsKey(disconnected.PlayerId) == false)
                return;

            state.OldPlayers[disconnected.PlayerId] = state.Players[disconnected.PlayerId].GetStoreData();
            state.Players[disconnected.PlayerId].PlayerHandler.PlayerLeft();
            state.Players.Remove(disconnected.PlayerId);
        }

        public void Process(PlayerInput input)
        {
            Console.WriteLine(input.playerInput);
            state.Players[input.PlayerId].PlayerHandler.Process(input.playerInput);
        }

        public void Process(GameUpdate input)
        {
            state.Games[input.GameId].Update();
        }
    }
}
