using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public interface IGameCommand
    {
        [JsonConverter(typeof(StringEnumConverter))]
        GameCommand command { get; }
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


    public class Pos {
        public float x;
        public float y;
    }

    public enum GameCommand
    {
        PlayerState,
        MazeFeild,
        CloseConnection,
        SetToken
    }

    public class SimpleMaze
    {
        private Timer timer;
        private MazePlayer firstPlayer;
        private MazePlayer secondPlayer;
        private WorldState state;
        private Guid gameId;

        public SimpleMaze(WorldState state, Guid gameId, MazePlayer firstPlayer)
        {
            LoadMaze();
            this.firstPlayer = firstPlayer;
            this.state = state;
            this.gameId = gameId;
        }

        private byte[,] mazeField;

        private void LoadMaze()
        {
            var s = Resources.Resource.maze;
            string[] lines = s.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);

            int width = int.Parse(lines[0]);
            int height = int.Parse(lines[1]);

            bool[,] maze = new bool[height, width];
            for (int y = 0; y < height; ++y)
                for (int x = 0; x < width; ++x)
                    maze[y, x] = lines[width * y + x + 2] == "0";

            mazeField = new byte[height / 2, width / 2];
            for (int y = 0; y < mazeField.GetLength(0); ++y)
                for (int x = 0; x < mazeField.GetLength(1); ++x)
                {
                    int mazeX = 2 * x + 1;
                    int mazeY = 2 * y + 1;

                    if (maze[mazeY - 1, mazeX])
                        mazeField[y, x] |= 1;

                    if (maze[mazeY, mazeX + 1])
                        mazeField[y, x] |= 2;

                    if (maze[mazeY + 1, mazeX])
                        mazeField[y, x] |= 4;

                    if (maze[mazeY, mazeX - 1])
                        mazeField[y, x] |= 8;
                }

        }


        public void Join(MazePlayer secondPlayer)
        {
            if (this.secondPlayer != null)
                throw new ArgumentException(nameof(secondPlayer));

            this.secondPlayer = secondPlayer;
            secondPlayer.SetStart(mazeField.GetLength(1)-1, mazeField.GetLength(0)-1);

            timer = new Timer(x => state.InputQueue.Post(new GameUpdate(gameId)), new object(), 100, 100);

            firstPlayer.output.SendAsync(new MazeField { field = mazeField });
            secondPlayer.output.SendAsync(new MazeField { field = mazeField });
        }

        BufferBlock<int> actionBlock = new BufferBlock<int>();
        public bool IsStarted => secondPlayer != null;

        public void Update()
        {
            firstPlayer.Update(mazeField);
            secondPlayer.Update(mazeField);

            firstPlayer.output.Post(new PlayerPos
            {
                myPos = firstPlayer.GetPos(),
                enemyPos = secondPlayer.GetPos()
            });

            secondPlayer.output.Post(new PlayerPos
            {
                myPos = secondPlayer.GetPos(),
                enemyPos = firstPlayer.GetPos()
            });
        }
    }

    public class MazePlayer
    {
        public InputCommand command;
        public readonly BufferBlock<IGameCommand> output;


        private int xPos = 0;
        private int yPos = 0;
        private int nextXPos = 0;
        private int nextYPos = 0;
        private float progress = 0;
        private InputCommand currentCommand;

        public MazePlayer(BufferBlock<IGameCommand> output)
        {
            this.output = output;
        }

        public Pos GetPos() => new Pos { x = xPos * (1 - progress) + nextXPos * progress, y = yPos * (1 - progress) + nextYPos * progress };

        public void SetStart(int x, int y)
        {
            xPos = nextXPos = x;
            yPos = nextYPos = y;
            progress = 0;
        }

        public void Update(byte[,] mazeField)
        {
            const float progressInTick = 0.5f;

            progress += progressInTick;
            if (progress > 1 || currentCommand == InputCommand.None)
            {
                xPos = nextXPos;
                yPos = nextYPos;
                if (command == InputCommand.Down && (mazeField[yPos, xPos] & 4) == 0)
                    nextYPos = yPos + 1;

                if (command == InputCommand.Up && (mazeField[yPos, xPos] & 1) == 0)
                    nextYPos = yPos - 1;

                if (command == InputCommand.Left && (mazeField[yPos, xPos] & 8) == 0)
                    nextXPos = xPos - 1;

                if (command == InputCommand.Right && (mazeField[yPos, xPos] & 2) == 0)
                    nextXPos = xPos + 1;

                if (nextYPos != yPos || nextXPos != xPos)
                {
                    if (progress > 1)
                        progress -= 1;
                    currentCommand = command;
                }
                else
                {
                    progress = 0;
                    currentCommand = InputCommand.None;
                }
            }
        }
    }
}
