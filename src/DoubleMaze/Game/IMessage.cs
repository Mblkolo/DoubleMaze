﻿using DoubleMaze.Infrastructure;
using DoubleMaze.Util;
using System;
using System.Threading;

namespace DoubleMaze.Game
{
    public interface IMessage
    {
    }

    public enum PlayerType
    {
        Human,
        Bot
    }

    public class PlayerConnected : IMessage
    {
        public readonly Guid PlayerId;
        public readonly Pipe<IGameCommand> OutputQueue;
        public readonly PlayerType PlayerType;

        public PlayerConnected(Guid playerId, Pipe<IGameCommand> outputQueue, PlayerType playerType)
        {
            PlayerId = playerId;
            OutputQueue = outputQueue;
            PlayerType = playerType;
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

    public class PlayerLoaded : IMessage
    {
        public readonly PlayerStoreData StoreData;
        public readonly CancellationToken Token;
        public readonly Pipe<IGameCommand> Output;

        public PlayerLoaded(PlayerStoreData storeData, CancellationToken token, Pipe<IGameCommand> output)
        {
            StoreData = storeData;
            Token = token;
            Output = output;
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
