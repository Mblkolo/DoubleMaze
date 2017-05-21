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
        private MazeGenerator mazeGenerator = new MazeGenerator();

        private Timer timer;
        private MazePlayer firstPlayer;
        private MazePlayer secondPlayer;
        private WorldState state;
        private Guid gameId;
        private MazeField mazeField;

        public SimpleMaze(WorldState state, Guid gameId, MazePlayer firstPlayer)
        {
            mazeField = mazeGenerator.Generate(21, 19);
            this.firstPlayer = firstPlayer;
            this.state = state;
            this.gameId = gameId;
        }


        public void Join(MazePlayer secondPlayer)
        {
            if (this.secondPlayer != null)
                throw new ArgumentException(nameof(secondPlayer));

            this.secondPlayer = secondPlayer;
            secondPlayer.SetStart(mazeField.Field.GetLength(1)-1, mazeField.Field.GetLength(0)-1);

            timer = new Timer(x => state.InputQueue.Post(new GameUpdate(gameId)), new object(), 100, 100);

            SendState(firstPlayer);
            SendState(secondPlayer);
        }

        public bool IsStarted => secondPlayer != null;
        public bool IsFinished { get; private set; } = false;

        public void Update()
        {
            if (IsFinished)
                return;

            firstPlayer.Update(mazeField.Field);
            secondPlayer.Update(mazeField.Field);

            if (mazeField.WinZone.Contains(firstPlayer.GetCurrentCeil()) || mazeField.WinZone.Contains(secondPlayer.GetCurrentCeil()))
            {
                IsFinished = true;
                timer.Dispose();

                SendState(firstPlayer);
                SendState(secondPlayer);
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

        public void SendState(MazePlayer player)
        {
            if(IsStarted == false)
            {
                player.Output.SendAsync(new WaitOpponent());
            }
            else if (IsFinished == false)
            {
                player.Output.SendAsync(new MazeFieldCommand { field = mazeField.Field });
            }
            else
            {
                player.Output.Post(new GameOverCommand
                {
                    status = mazeField.WinZone.Contains(player.GetCurrentCeil())
                        ? GameOverCommand.Statuses.Win
                        : GameOverCommand.Statuses.Lose
                });
            }
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

        public bool Contains(Point pos)
        {
            return Left <= pos.X && pos.X < Left + Width && 
                    Top <= pos.Y && pos.Y < Top + Height;
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

        public void Update(Wall[,] mazeField)
        {
            const float progressInTick = 0.3f;

            progress += progressInTick;
            if (progress > 1 || currentCommand == InputCommand.None)
            {
                pos = nextpos;
                if (Сommand == InputCommand.Down && (mazeField[pos.Y, pos.X] & Wall.Bottom) == 0)
                    nextpos = pos.Move(0, 1);

                if (Сommand == InputCommand.Up && (mazeField[pos.Y, pos.X] & Wall.Top) == 0)
                    nextpos = pos.Move(0, -1);

                if (Сommand == InputCommand.Left && (mazeField[pos.Y, pos.X] & Wall.Left) == 0)
                    nextpos = pos.Move(-1, 0);

                if (Сommand == InputCommand.Right && (mazeField[pos.Y, pos.X] & Wall.Right) == 0)
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
