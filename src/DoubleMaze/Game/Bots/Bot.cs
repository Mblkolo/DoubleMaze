using DoubleMaze.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game.Bots
{
    public class Bot
    {
        public readonly Pipe<IGameCommand> Input = new Pipe<IGameCommand>();
        public readonly string Name;
        public readonly Guid BotId = Guid.NewGuid();

        private readonly int depth;
        private readonly Pipe<IMessage> Output;
        private readonly Task ProcessTask;

        public Bot(Pipe<IMessage> output, int depth)
        {
            Output = output;
            this.depth = depth;
            Name = $"Бот {depth}";
            ProcessTask = Process();
        }

        private async Task Process()
        {
            Output.Post(new PlayerConnected(BotId, Input, PlayerType.Bot));

            while (await Input.OutputAvailableAsync())
            {
                IGameCommand command = await Input.ReceiveAsync();

                Process((dynamic)command);
            }
        }

        private void Process(IGameCommand command)
        {
            //Неизвестная комманда
        }

        private void Process(GameOverCommand command)
        {
            Output.Post(new PlayerInput(BotId, new PlayAgainInput()));
        }

        private MazeSolver solver;

        private void Process(GotoCommand command)
        {
            if (command.area != GotoCommand.Areas.Game)
                solver = null;

            if(command.area == GotoCommand.Areas.Stasis)
                Output.Post(new PlayerInput(BotId, new PlayerNameInput(Name)));
        }

        private void Process(PlayerPosCommand command)
        {
            var inputCommand = solver.ProcessPos(command.myPos);
            if(inputCommand != InputCommand.None)
                Output.Post(new PlayerInput(BotId, new KeyDownInput(inputCommand)));
        }

        private void Process(MazeFieldCommand command)
        {
            solver = new MazeSolver(command.field, depth);
        }
    }

    class MazeSolver
    {
        private readonly int width;
        private readonly int height;
        private readonly Wall[,] field;
        private readonly int depth;

        public MazeSolver(Wall[,] field, int depth)
        {
            this.field = field;
            this.depth = depth;
            width = field.GetLength(1);
            height = field.GetLength(0);
        }

        private Point latestPoint;
        private CellColor[,] colors = null;
        private Random r = new Random();

        public InputCommand ProcessPos(Pos pos)
        {
            Point p = new Point(round(pos.x), round(pos.y));

            if (colors == null)
            {
                colors = new CellColor[height, width];

                for(int i=0; i < depth; ++i)
                {
                    var tmpColor = new CellColor[height, width];
                    Array.Copy(colors, tmpColor, colors.Length);

                    for (int y = 0; y < height; ++y)
                        for (int x = 0; x < width; x++)
                        {
                            var cutPus = new Point(x, y);
                            if (cutPus != p && isDeadEnd(cutPus))
                                tmpColor[cutPus.Y, cutPus.X] = CellColor.Black;
                        }

                    colors = tmpColor;
                }

                latestPoint = p;
                return GetPossibleDirection(latestPoint);
            }

            if(latestPoint != p)
            {
                colors[latestPoint.Y, latestPoint.X] = isDeadEnd(latestPoint) ? CellColor.Black : CellColor.Gray;

                latestPoint = p;
                return GetPossibleDirection(latestPoint);
            }

            return InputCommand.None;
        }

        private Direction[] directions = {
            new Direction( Wall.Bottom, new Point(0, 1), InputCommand.Down),
            new Direction( Wall.Top, new Point(0, -1), InputCommand.Up),
            new Direction( Wall.Left, new Point(-1, 0), InputCommand.Left),
            new Direction( Wall.Right, new Point(1, 0), InputCommand.Right),
        };

        InputCommand GetPossibleDirection(Point pos)
        {
            InputCommand whiteDirection = getPosibleWhiteDirections(pos);
            if (whiteDirection != InputCommand.None)
            {
                return whiteDirection;
            }

            return getGrayDirection(pos);
        }

        private InputCommand getPosibleWhiteDirections(Point point)
        {
            var possibleDirections = getNearbyCells(point, color => color == CellColor.White);

            if (possibleDirections.Length == 0)
                return InputCommand.None;

            Direction min = null;
            var nearbyPoint = new Point(int.MaxValue, int.MaxValue);
            double minLength = double.MaxValue;

            for (int i=0; i<possibleDirections.Length; ++i)
            {
                nearbyPoint = point.Move(possibleDirections[i].offset.X, possibleDirections[i].offset.Y);
                double newMinLength = Math.Pow(Math.Abs(width / 2 - nearbyPoint.X), 2) 
                                    + Math.Pow(Math.Abs(height / 2 - nearbyPoint.Y), 2);

                if (newMinLength < minLength)
                {
                    minLength = newMinLength;
                    min = possibleDirections[i];
                }
            }

            return min.inputCommand;
        }

        private InputCommand getGrayDirection(Point point)
        {
            return getNearbyCells(point, color => color == CellColor.Gray)
                .Select(x => (InputCommand?)x.inputCommand)
                .SingleOrDefault() ?? InputCommand.None;
        }

        private bool isDeadEnd(Point point)
        {
            return getNearbyCells(point, color => color != CellColor.Black).Count() < 2;
        }

        private Direction[] getNearbyCells(Point point, Func<CellColor, bool> test)
        {
            var fieldZone = new RectZone(0, 0, width, height);

            var nearby = new List<Direction>();
            foreach (var d in directions)
            {
                var p = point.Move(d.offset.X, d.offset.Y);
                if (fieldZone.Contains(p) && (field[point.Y, point.X] & d.wall) == Wall.None && test(colors[p.Y, p.X]))
                    nearby.Add(d);
            }
            return nearby.ToArray();
        }

        private int round(float pos) => (int)Math.Round(pos);


        private enum CellColor
        {
            White,
            Gray,
            Black
        }

        private class Direction
        {
            public Wall wall;
            public InputCommand inputCommand;
            public Point offset;

            public Direction(Wall wall, Point offset, InputCommand inputCommand)
            {
                this.wall = wall;
                this.offset = offset;
                this.inputCommand = inputCommand;
            }
        }
    }
}
