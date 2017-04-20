using System;
using System.Collections.Generic;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public interface IMessage
    {
    }

    public class NewConnection : IMessage
    {
        public readonly Guid PlayerId;
        public readonly BufferBlock<object> OutputQueue;

        public NewConnection(Guid playerId, BufferBlock<object> outputQueue)
        {
            PlayerId = playerId;
            OutputQueue = outputQueue;
        }
    }

    public class PlayerInput : IMessage
    {
        public readonly Guid PlayerId;
        public readonly string Message;

        public PlayerInput(Guid playerId, string input)
        {
            PlayerId = playerId;
            Message = input;
        }
    }

    public class MessageDispatcher
    {
        Dictionary<Guid, BufferBlock<object>> Players = new Dictionary<Guid, BufferBlock<object>>();

        public void Process(NewConnection connection)
        {
            Players[connection.PlayerId] = connection.OutputQueue;
        }

        public void Process(PlayerInput input)
        {
            Console.WriteLine(input.Message);
            Players[input.PlayerId].Post(input.Message);
        }
    }
}
