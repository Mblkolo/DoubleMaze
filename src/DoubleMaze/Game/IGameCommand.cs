using System;

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
        PlayerInfo, 
        ShowBots
    }

    public class PlayerPosCommand : IGameCommand
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
        public decimal rating { get; set; }
    }

    public class SetTokenCommand : IGameCommand
    {
        public GameCommand command => GameCommand.SetToken;
        public string playerId { get; set; }
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
        public decimal rating { get; set; }
        public bool isMe { get; set; }
        public bool isEnemy { get; set; }
    }

    public class GotoCommand : IGameCommand
    {
        public enum Areas
        {
            Welcome,
            Game,
            Return,
            Wait,
            Stasis
        }

        public GameCommand command => GameCommand.Goto;
        public Areas area { get; set; }
    }

    public class PlayerInfo : IGameCommand
    {
        public GameCommand command => GameCommand.PlayerInfo;
        public decimal rating { get; set; }
        public string name { get; set; }
    }

    public class ShowBotsCommand : IGameCommand
    {
        public GameCommand command => GameCommand.ShowBots;

        public ShowBotsBot[] bots { get; set; }
    }

    public class ShowBotsBot
    {
        public string id { get; set; }
        public bool isAwaible { get; set; }
        public string name { get; set; }
        public decimal rating { get; set; }
    }
}
