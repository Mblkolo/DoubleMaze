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
        public BufferBlock<object> Output { get; private set; }
        public IPlayerHandler PlayerHandler { get; set; }

        public string Name { get; set; }

        public PlayerContex(BufferBlock<object> output)
        {
            Output = output;
        }
    }

    public class MessageDispatcher
    {
        private BufferBlock<IMessage> inputQueue;
        private WorldState state;

        public MessageDispatcher(BufferBlock<IMessage> inputQueue)
        {
            state = new WorldState();
            state.InputQueue = inputQueue;
        }

        public void Process(NewConnection connection)
        {
            var playerContext = new PlayerContex(connection.OutputQueue)
            {
                PlayerHandler = new WelcomeAreaHandler(connection.PlayerId, state)
            };

            state.Players.Add(connection.PlayerId, playerContext);
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
