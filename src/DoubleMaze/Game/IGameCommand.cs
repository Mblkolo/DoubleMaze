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
        GameOver
    }

    public class PlayerPos : IGameCommand
    {
        public GameCommand command => GameCommand.PlayerState;
        public Pos myPos { get; set; }
        public Pos enemyPos { get; set; }
    }

    public class MazeField : IGameCommand
    {
        public GameCommand command => GameCommand.MazeFeild;
        public byte[,] field { get; set; }
    }

    public class SetTokenCommand : IGameCommand
    {
        public GameCommand command => GameCommand.SetToken;
        public string Token { get; set; }
    }



    public class GameOverCommand : IGameCommand
    {
        public enum Statuses
        {
            Win,
            Lose
        }

        public GameCommand command => GameCommand.GameOver;
        public Statuses Status { get; set; }
    }
}
