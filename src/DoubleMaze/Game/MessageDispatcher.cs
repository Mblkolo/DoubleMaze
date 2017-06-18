using DoubleMaze.Game.Maze;
using DoubleMaze.Util;
using System;
using System.Collections.Generic;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public class WorldState
    {
        public Dictionary<Guid, PlayerContex> Players = new Dictionary<Guid, PlayerContex>();
        public Dictionary<Guid, SimpleMaze> Games = new Dictionary<Guid, SimpleMaze>();

        public BufferBlock<IMessage> InputQueue;
    }

    public class PlayerContex
    {

        public Guid Id { get; }
        public BufferBlock<IGameCommand> Output { get; set; }
        public IPlayerHandler PlayerHandler { get; private set; }

        public string Name { get; set; }
        public Rating Rating { get; set; } = new Rating();

        public PlayerContex(Guid id, BufferBlock<IGameCommand> output)
        {
            Output = output;
            Id = id;
        }

        public void SetHandler(IPlayerHandler handler)
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

        public MessageDispatcher(BufferBlock<IMessage> inputQueue)
        {
            state = new WorldState();
            state.InputQueue = inputQueue;
        }

        public void Process(PlayerConnected connection)
        {
            if (state.Players.ContainsKey(connection.PlayerId) == false)
            {
                var playerContext = new PlayerContex(connection.PlayerId, connection.OutputQueue);
                state.Players.Add(connection.PlayerId, playerContext);

                playerContext.SetHandler(new WelcomeAreaHandler(connection.PlayerId, state));
            }
            else
            {
                state.Players[connection.PlayerId].Output = connection.OutputQueue;
                state.Players[connection.PlayerId].PlayerHandler.PlayerJoin();
            }
        }

        public void Process(PlayerDisconnected disconnected)
        {
            if (state.Players.ContainsKey(disconnected.PlayerId) == false)
                return;

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
