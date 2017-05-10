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
        WaitOpponent
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
        public byte[,] field { get; set; }
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
    }

    public class GotoCommand : IGameCommand
    {
        public enum Areas
        {
            Welcome,
            Game
        }

        public GameCommand command => GameCommand.Goto;
        public Areas area { get; set; }
    }

    public class WaitOpponent : IGameCommand
    {
        public GameCommand command => GameCommand.WaitOpponent;
    }
}
