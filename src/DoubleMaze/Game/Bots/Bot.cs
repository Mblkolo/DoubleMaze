using DoubleMaze.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Game.Bots
{
    public class Bot : Actor<IGameCommand>
    {
        public readonly string Name;
        public readonly Guid BotId;

        private readonly int depth;
        private readonly Pipe<IMessage> Output;

        public Bot(Pipe<IMessage> output, int depth, Guid botId, ILoggerFactory factory)
            : base(factory.CreateLogger<Bot>())
        {
            Output = output;
            this.depth = depth;
            BotId = botId;
            Name = $"Бот {depth}";

            StartProcess();
        }


        protected override async Task Proccess()
        {
            Output.Post(new PlayerConnected(BotId, Pipe, PlayerType.Bot));

            await Loop(message => Process((dynamic)message));
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
        private CellColor[,] colors;

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
                            if (cutPus != p && IsDeadEnd(cutPus))
                                tmpColor[cutPus.Y, cutPus.X] = CellColor.Black;
                        }

                    colors = tmpColor;
                }

                latestPoint = p;
                return GetPossibleDirection(latestPoint);
            }

            if(latestPoint != p)
            {
                colors[latestPoint.Y, latestPoint.X] = IsDeadEnd(latestPoint) ? CellColor.Black : CellColor.Gray;

                latestPoint = p;
                return GetPossibleDirection(latestPoint);
            }

            return InputCommand.None;
        }

        private readonly Direction[] directions = {
            new Direction( Wall.Bottom, new Point(0, 1), InputCommand.Down),
            new Direction( Wall.Top, new Point(0, -1), InputCommand.Up),
            new Direction( Wall.Left, new Point(-1, 0), InputCommand.Left),
            new Direction( Wall.Right, new Point(1, 0), InputCommand.Right),
        };

        InputCommand GetPossibleDirection(Point pos)
        {
            InputCommand whiteDirection = GetPosibleWhiteDirections(pos);
            if (whiteDirection != InputCommand.None)
            {
                return whiteDirection;
            }

            return GetGrayDirection(pos);
        }

        private InputCommand GetPosibleWhiteDirections(Point point)
        {
            var possibleDirections = GetNearbyCells(point, color => color == CellColor.White);

            if (possibleDirections.Length == 0)
                return InputCommand.None;

            Direction min = null;
            double minLength = double.MaxValue;

            for (int i=0; i<possibleDirections.Length; ++i)
            {
                var nearbyPoint = point.Move(possibleDirections[i].offset.X, possibleDirections[i].offset.Y);
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

        private InputCommand GetGrayDirection(Point point)
        {
            return GetNearbyCells(point, color => color == CellColor.Gray)
                .Select(x => (InputCommand?)x.inputCommand)
                .SingleOrDefault() ?? InputCommand.None;
        }

        private bool IsDeadEnd(Point point)
        {
            return GetNearbyCells(point, color => color != CellColor.Black).Length < 2;
        }

        private Direction[] GetNearbyCells(Point point, Func<CellColor, bool> test)
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
            public readonly Wall wall;
            public readonly InputCommand inputCommand;
            public readonly Point offset;

            public Direction(Wall wall, Point offset, InputCommand inputCommand)
            {
                this.wall = wall;
                this.offset = offset;
                this.inputCommand = inputCommand;
            }
        }
    }
}
