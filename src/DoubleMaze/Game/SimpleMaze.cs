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
    public interface IGameState
    {
        [JsonConverter(typeof(StringEnumConverter))]
        GameCommand command { get; }
    }

    public class PlayerPos : IGameState
    {
        public GameCommand command => GameCommand.PlayerState;
        public Pos pos { get; set; }
    }

    public class MazeField : IGameState
    {
        public GameCommand command => GameCommand.MazeFeild;
        public byte[,] field { get; set; }
    }


    public class Pos {
        public float x;
        public float y;
    }

    public enum GameCommand
    {
        PlayerState,
        MazeFeild
    }

    public enum InputCommand
    {
        None,
        Up,
        Left,
        Right,
        Down
    }

    public class SimpleMaze
    {
        private readonly Func<IGameState, Task> callback;
        private readonly Timer timer;

        public SimpleMaze(Func<IGameState, Task> callback)
        {
            this.callback = callback;

            LoadMaze();
            callback(new MazeField { field = mazeField });

            timer = new Timer(Update, new object(), 0, 100);
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


        private volatile InputCommand latestCommand;

        private Pos PlayerPos = new Pos();
        Random r = new Random();

        private const float progressInTick = 0.5f;
        private int xPos = 0;
        private int yPos = 0;
        private int nextXPos = 0;
        private int nextYPos = 0;
        private float progress = 0;
        private InputCommand currentCommand;

        BufferBlock<int> actionBlock = new BufferBlock<int>();

        public void Update(object o)
        {
            var command = latestCommand;

            //bool needUpdate = false;
            //if(currentCommand == InputCommand.None && command != InputCommand.None)
            //{
            //    needUpdate = true;
            //    //progress = 0;
            //}

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
                    if(progress > 1)
                        progress -= 1;
                    currentCommand = command;
                }
                else
                {
                    progress = 0;
                    currentCommand = InputCommand.None;
                }
            }
            

            //if(needUpdate)
            //{
                
            //}

            callback(new PlayerPos
            {
                pos = new Pos { x = xPos*(1-progress) + nextXPos * progress, y = yPos * (1 - progress) + nextYPos * progress }
            });
        }


        public void Execute(InputCommand command)
        {
            latestCommand = command;
        }
    }
}
