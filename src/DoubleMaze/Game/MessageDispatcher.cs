﻿using DoubleMaze.Game.Areas;
using DoubleMaze.Game.Bots;
using DoubleMaze.Game.Maze;
using DoubleMaze.Infrastructure;
using DoubleMaze.Storage;
using DoubleMaze.Util;
using System;
using System.Collections.Generic;
using System.Threading;

namespace DoubleMaze.Game
{
    public class WorldState
    {
        public Dictionary<Guid, PlayerContex> Players = new Dictionary<Guid, PlayerContex>();
        public Dictionary<Guid, SimpleMaze> Games = new Dictionary<Guid, SimpleMaze>();
        public Guid? WaitPlayer;

        public Pipe<IMessage> InputQueue;

        public List<Bot> Bots = new List<Bot>();
        public HashSet<Guid> BotInGame = new HashSet<Guid>();
    }

    public class PlayerStoreData
    {
        public PlayerType PlayerType { get; set; }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public Rating Rating { get; set; }
        public bool IsActivated { get; internal set; }
    }

    public class PlayerContex
    {
        public Guid Id { get; }
        public PlayerType PlayerType { get; }

        public Pipe<IGameCommand> Output { get; set; }
        public IAreaHandler PlayerHandler { get; private set; }

        public string Name { get; set; }
        public bool IsActivated { get; set; }
        public Rating Rating { get; private set; }

        public PlayerContex(PlayerStoreData storeData, Pipe<IGameCommand> output)
        {
            Output = output;

            Id = storeData.Id;
            Rating = storeData.Rating;
            Name = storeData.Name;
            IsActivated = storeData.IsActivated;
            PlayerType = storeData.PlayerType;
        }

        internal void ResetPlayer()
        {
            Rating = new Rating();
            Name = null;
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
        private WorldState state;
        private IStorage storage;

        private Dictionary<Guid, CancellationTokenSource> LoadingsPlayers = new Dictionary<Guid, CancellationTokenSource>();

        public MessageDispatcher(Pipe<IMessage> inputQueue)
        {
            state = new WorldState();
            state.InputQueue = inputQueue;

            state.Bots.Add(new Bot(inputQueue, 5));
            state.Bots.Add(new Bot(inputQueue, 9));
            state.Bots.Add(new Bot(inputQueue, 13));
            state.Bots.Add(new Bot(inputQueue, 17));
            state.Bots.Add(new Bot(inputQueue, 21));

            //TODO заменить иньекцией
            storage = new InMemoryStorage();
        }

        private bool canProcess(Guid playerId) => state.Players.ContainsKey(playerId);

        public void Process(PlayerConnected connection)
        {
            var playerId = connection.PlayerId;

            PlayerContex context;
            if (state.Players.TryGetValue(playerId, out context))
            {
                context.Output = connection.OutputQueue;
                context.PlayerHandler.PlayerJoin();
            }
            else
            {
                var source = new CancellationTokenSource();
                LoadingsPlayers.Add(playerId, source);

                storage.LoadPlayer(playerId, connection.PlayerType, x =>
                {
                    state.InputQueue.Post(new PlayerLoaded(x, source.Token, connection.OutputQueue));
                });
            }
        }

        public void Process(PlayerLoaded playerLoaded)
        {
            if (playerLoaded.Token.IsCancellationRequested)
                return;

            var playerContext = new PlayerContex(playerLoaded.StoreData, playerLoaded.Output);

            state.Players.Add(playerContext.Id, playerContext);

            IAreaHandler handler = playerContext.PlayerType == PlayerType.Bot
                ? new StasisAreaHandler(playerContext.Id, state)
                : (playerLoaded.StoreData.IsActivated 
                        ? (IAreaHandler)new ReturnAreaHandler(playerContext.Id, state)
                        : new WelcomeAreaHandler(playerContext.Id, state));

            playerContext.SetHandler(handler);
        }

        public void Process(PlayerDisconnected disconnected)
        {
            var playerId = disconnected.PlayerId;
            if (canProcess(playerId) == false)
                return;

            LoadingsPlayers.Remove(playerId, x => x.Cancel());

            state.Players.RemoveOrThrow(playerId, x =>
            {
                storage.SavePlayer(state.Players[playerId].GetStoreData());
                x.PlayerHandler.PlayerLeft();
            });
        }

        public void Process(PlayerInput input)
        {
            Console.WriteLine(input.playerInput);

            if (canProcess(input.PlayerId))
            {
                state.Players[input.PlayerId].PlayerHandler.Process(input.playerInput);
            }
        }

        public void Process(GameUpdate input)
        {
            state.Games[input.GameId].Update();
        }
    }
}
