using DoubleMaze.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public interface IMessage
    {
    }

    public class PlayerConnected : IMessage
    {
        public readonly Guid PlayerId;
        public readonly BufferBlock<IGameCommand> OutputQueue;

        public PlayerConnected(Guid playerId, BufferBlock<IGameCommand> outputQueue)
        {
            PlayerId = playerId;
            OutputQueue = outputQueue;
        }
    }

    public class PlayerDisconnected : IMessage
    {
        public readonly Guid PlayerId;

        public PlayerDisconnected(Guid playerId)
        {
            PlayerId = playerId;
        }
    }

    public class PlayerInput : IMessage
    {
        public readonly Guid PlayerId;
        public readonly IPlayerInput playerInput;

        public PlayerInput(Guid playerId, IPlayerInput input)
        {
            PlayerId = playerId;
            playerInput = input;
        }

        public override string ToString()
        {
            return ObjectDumper.Dump(this);
        }
    }

    public class GameUpdate : IMessage
    {
        public readonly Guid GameId;

        public GameUpdate(Guid gameId)
        {
            GameId = gameId;
        }
    }
}
