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

        private readonly Pipe<IMessage> Output;
        private readonly Task ProcessTask;

        public Bot(Pipe<IMessage> output, string name)
        {
            Output = output;
            Name = name;
            ProcessTask = Process();
        }

        private async Task Process()
        {
            Output.Post(new PlayerConnected(BotId, Input, PlayerType.Bot));
            Output.Post(new PlayerInput(BotId, new PlayerNameInput(Name)));

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
        }

        private void Process(PlayerPosCommand command)
        {
            var inputCommand = solver.ProcessPos(command.myPos);
            if(inputCommand != InputCommand.None)
                Output.Post(new PlayerInput(BotId, new KeyDownInput(inputCommand)));
        }

        private void Process(MazeFieldCommand command)
        {
            solver = new MazeSolver(command.field);
        }
    }

    class MazeSolver
    {
        private readonly int width;
        private readonly int height;
        private readonly Wall[,] field;

        public MazeSolver(Wall[,] field)
        {
            this.field = field;
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
            InputCommand[] whiteDirections = getPosibleWhiteDirections(pos);
            if (whiteDirections.Length > 0)
            {
                //выбруть случайное направление
                return whiteDirections[r.Next(whiteDirections.Length)];
            }

            return getGrayDirection(pos);
        }

        private InputCommand[] getPosibleWhiteDirections(Point point)
        {
            return getNearbyCells(point, color => color == CellColor.White)
                .Select(x => x.inputCommand)
                .ToArray();
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
