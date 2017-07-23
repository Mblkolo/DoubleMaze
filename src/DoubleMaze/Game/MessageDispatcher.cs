using DoubleMaze.Game.Areas;
using DoubleMaze.Game.Bots;
using DoubleMaze.Game.Maze;
using DoubleMaze.Infrastructure;
using DoubleMaze.Storage;
using System;
using System.Collections.Generic;

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

        //TODO избавиться от этой переменной, протаскивать Pipe<IGameCommand> через стородж
        private Dictionary<Guid, Pipe<IGameCommand>> LoadedPlayers = new Dictionary<Guid, Pipe<IGameCommand>>();

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
            if (state.Players.ContainsKey(connection.PlayerId))
            {
                state.Players[connection.PlayerId].Output = connection.OutputQueue;
                state.Players[connection.PlayerId].PlayerHandler.PlayerJoin();
            }
            else
            {
                LoadedPlayers.Add(connection.PlayerId, connection.OutputQueue);
                storage.LoadPlayer(connection.PlayerId, connection.PlayerType, x => state.InputQueue.Post(x));
            }
        }

        public void Process(PlayerLoaded playerLoaded)
        {
            var playerContext = new PlayerContex(playerLoaded.StoreData, LoadedPlayers[playerLoaded.StoreData.Id]);
            LoadedPlayers.Remove(playerLoaded.StoreData.Id);

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
            if (canProcess(disconnected.PlayerId) == false)
                return;

            storage.SavePlayer(state.Players[disconnected.PlayerId].GetStoreData());

            //state.OldPlayers[disconnected.PlayerId] = state.Players[disconnected.PlayerId].GetStoreData();

            state.Players[disconnected.PlayerId].PlayerHandler.PlayerLeft();
            state.Players.Remove(disconnected.PlayerId);
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
