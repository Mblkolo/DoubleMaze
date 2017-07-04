﻿using System;

namespace DoubleMaze.Game
{
    public interface IGameCommand
    {
        GameCommand command { get; }
    }

    public enum GameCommand
    {
        PlayerState,
        MazeFeild,
        CloseConnection,
        SetToken,
        GameOver,
        Goto,
        WaitOpponent,
        PlayerInfo
    }

    public class PlayerPos : IGameCommand
    {
        public GameCommand command => GameCommand.PlayerState;
        public Pos myPos { get; set; }
        public Pos enemyPos { get; set; }
    }

    public class MazeFieldCommand : IGameCommand
    {
        public GameCommand command => GameCommand.MazeFeild;

        public Wall[,] field { get; set; }

        public MazeFieldCommandPlayer me { get; set; } 
        public MazeFieldCommandPlayer enemy { get; set; }
    }

    public class MazeFieldCommandPlayer
    {
        public string name { get; set; }
        public double rating { get; set; }
    }

    public class SetTokenCommand : IGameCommand
    {
        public GameCommand command => GameCommand.SetToken;
        public string token { get; set; }
    }



    public class GameOverCommand : IGameCommand
    {
        public enum Statuses
        {
            Win,
            Lose
        }

        public GameCommand command => GameCommand.GameOver;
        public Statuses status { get; set; }

        public GameOverCommandRating[] ratings {get; set;}
    }

    public class GameOverCommandRating
    {
        public string name { get; set; }
        public double rating { get; set; }
        public bool isMe { get; set; }
        public bool isEnemy { get; set; }
    }

    public class GotoCommand : IGameCommand
    {
        public enum Areas
        {
            Welcome,
            Game,
            Return
        }

        public GameCommand command => GameCommand.Goto;
        public Areas area { get; set; }
    }

    public class PlayerInfo : IGameCommand
    {
        public GameCommand command => GameCommand.PlayerInfo;
        public double rating { get; set; }
        public string name { get; set; }
    }

    public class WaitOpponent : IGameCommand
    {
        public GameCommand command => GameCommand.WaitOpponent;
    }
}
