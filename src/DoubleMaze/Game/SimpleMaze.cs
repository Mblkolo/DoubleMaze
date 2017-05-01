using System;
using System.Threading;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public class Pos {
        public float x;
        public float y;
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

            SendState(firstPlayer);
            SendState(secondPlayer);
        }

        BufferBlock<int> actionBlock = new BufferBlock<int>();
        public bool IsStarted => secondPlayer != null;
        public bool IsFinished { get; private set; } = false;

        private RectZone WinZone = new RectZone(10, 6, 4, 3);

        public void Update()
        {
            if (IsFinished)
                return;

            firstPlayer.Update(mazeField);
            secondPlayer.Update(mazeField);

            if (WinZone.Contians(firstPlayer.GetCurrentCeil()))
            {
                GameOver(firstPlayer, secondPlayer);
                return;
            }

            if (WinZone.Contians(secondPlayer.GetCurrentCeil()))
            {
                GameOver(secondPlayer, firstPlayer);
                return;
            }

            firstPlayer.Output.Post(new PlayerPos
            {
                myPos = firstPlayer.GetPos(),
                enemyPos = secondPlayer.GetPos()
            });

            secondPlayer.Output.Post(new PlayerPos
            {
                myPos = secondPlayer.GetPos(),
                enemyPos = firstPlayer.GetPos()
            });
        }

        internal void SendState(MazePlayer player)
        {
            player.Output.SendAsync(new MazeField { field = mazeField });
        }

        private void GameOver(MazePlayer winner, MazePlayer looser)
        {
            IsFinished = true;

            timer.Dispose();
            winner.Output.Post(new GameOverCommand
            {
                status = GameOverCommand.Statuses.Win
            });
            looser.Output.Post(new GameOverCommand
            {
                status = GameOverCommand.Statuses.Lose
            });
        }
    }

    public struct RectZone
    {
        public readonly int Left;
        public readonly int Top;
        public readonly int Width;
        public readonly int Height;

        public RectZone(int left, int top, int width, int height)
        {
            Left = left;
            Top = top;
            Width = width;
            Height = height;
        }

        public bool Contians(Point pos)
        {
            return Left <= pos.X && pos.X < Left + Width && Top < pos.Y && pos.Y < Top + Height ;
        }

        public override string ToString()
        {
            return $"Left:{Left}, Top:{Top}, Width:{Width}, Height:{Height}";
        }
    }

    public struct Point
    {
        public readonly int X;
        public readonly int Y;

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public Point Move(int dx, int dy)
        {
            return new Point(X + dx, Y + dy);
        }

        public override string ToString()
        {
            return $"X:{X}, Y:{Y}";
        }
    }

    public class MazePlayer
    {
        public InputCommand Сommand;
        public readonly BufferBlock<IGameCommand> Output;


        private Point pos = new Point();
        private Point nextpos = new Point();
        private float progress = 0;
        private InputCommand currentCommand;

        public MazePlayer(BufferBlock<IGameCommand> output)
        {
            Output = output;
        }

        public Pos GetPos() => new Pos { x = pos.X * (1 - progress) + nextpos.X * progress, y = pos.Y * (1 - progress) + nextpos.Y * progress };

        public Point GetCurrentCeil() => new Point(pos.X, pos.Y);

        public void SetStart(int x, int y)
        {
            pos = nextpos = new Point(x, y);
            progress = 0;
        }

        public void Update(byte[,] mazeField)
        {
            const float progressInTick = 0.5f;

            progress += progressInTick;
            if (progress > 1 || currentCommand == InputCommand.None)
            {
                pos = nextpos;
                if (Сommand == InputCommand.Down && (mazeField[pos.Y, pos.X] & 4) == 0)
                    nextpos = pos.Move(0, 1);

                if (Сommand == InputCommand.Up && (mazeField[pos.Y, pos.X] & 1) == 0)
                    nextpos = pos.Move(0, -1);

                if (Сommand == InputCommand.Left && (mazeField[pos.Y, pos.X] & 8) == 0)
                    nextpos = pos.Move(-1, 0);

                if (Сommand == InputCommand.Right && (mazeField[pos.Y, pos.X] & 2) == 0)
                    nextpos = pos.Move(1, 0);

                if (nextpos.Y != pos.Y || nextpos.X != pos.X)
                {
                    if (progress > 1)
                        progress -= 1;
                    currentCommand = Сommand;
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
