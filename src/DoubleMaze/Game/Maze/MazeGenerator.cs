using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    [Flags]
    public enum Wall : byte
    {
        None = 0,
        Top = 1 << 0,
        Right = 1 << 1,
        Bottom = 1 << 2,
        Left = 1 << 3,
        Full = Top | Right | Bottom | Left
    }

    public class MazeField
    {
        public readonly Wall[,] Field;
        public RectZone WinZone;

        public MazeField(Wall[,] field, RectZone winZone)
        {
            Field = field;
            WinZone = winZone;
        }
    }

    public class MazeGenerator
    {
        public MazeField Generate(int width, int height)
        {

            var field = CreateField(width, height);
            var winZone = CreateWinZone(width, height);
            EraseWinZone(field, winZone);

            var random = new Random();
            GenerateWays(field, winZone, random);
            //GenerateWinZoneEnter(field, winZone, random);
            GenerateFarWinZoneEnter(field, winZone, random);

            return new MazeField(field, winZone);
        }

        protected Wall[,] CreateField(int width, int height)
        {
            var field = new Wall[height, width];
            for (int y = 0; y < height; y++)
                for (int x = 0; x < width; ++x)
                    field[y, x] = Wall.Full;

            return field;
        }

        protected RectZone CreateWinZone(int width, int height)
        {
            var rw = 2 + width % 2;
            var rh = 2 + height % 2;
            return new RectZone((width - rw) / 2, (height - rh) / 2, rw, rh);
        }

        protected void EraseWinZone(Wall[,] field, RectZone winZone)
        {
            for (int y = 0; y < winZone.Height; ++y)
            {
                for (int x = 0; x < winZone.Width; ++x)
                {
                    int realX = x + winZone.Left;
                    int realY = y + winZone.Top;

                    if (y != 0)
                        field[realY, realX] &= (~Wall.Top);

                    if (y != winZone.Height - 1)
                        field[realY, realX] &= (~Wall.Bottom);

                    if (x != 0)
                        field[realY, realX] &= (~Wall.Left);

                    if (x != winZone.Width - 1)
                        field[realY, realX] &= (~Wall.Right);
                }
            }
        }

        protected void GenerateWays(Wall[,] field, RectZone winZone, Random random)
        {
            var fieldRect = new RectZone(0, 0, field.GetLength(1), field.GetLength(0));
            int moveCount = (fieldRect.Width * fieldRect.Height - winZone.Width * winZone.Height - 2) / 2;

            var currentPos = new Point(0, 0);
            var latestMove = Moves[random.Next(4)];
            int count = 0;
            while (moveCount > 0)
            {
                count++;
                if (count > 100000)
                    throw new Exception("Слишком долго!");

                var randNumber = random.Next(5);

                var move = randNumber < Moves.Length ? Moves[randNumber] : latestMove;
                latestMove = move;

                var newPos = currentPos.Move(move.Direction.X, move.Direction.Y);

                if (fieldRect.Contains(newPos) == false)
                {
                    continue;
                }

                bool notInWinZone = winZone.Contains(newPos) == false && winZone.Contains(currentPos) == false;
                bool fromNotFullCell = field[currentPos.Y, currentPos.X] != Wall.Full;
                bool toFullCell = field[newPos.Y, newPos.X] == Wall.Full;
                bool fromStartPoint = currentPos.Y == 0 && currentPos.X == 0;

                if (notInWinZone && (fromNotFullCell || fromStartPoint) && toFullCell)
                {
                    DestroyWall(field, move, currentPos, newPos);
                    moveCount--;
                }

                currentPos = newPos;
            }

            Console.WriteLine(count);
        }

        private readonly static Move[] Moves = new[]
            {
                new Move{Direction = new Point(0, 1),  FromWall = Wall.Bottom, ToWall = Wall.Top },
                new Move{Direction = new Point(0, -1), FromWall = Wall.Top, ToWall = Wall.Bottom },
                new Move{Direction = new Point(1, 0),  FromWall = Wall.Right, ToWall = Wall.Left },
                new Move{Direction = new Point(-1, 0), FromWall = Wall.Left, ToWall = Wall.Right }
            };

        protected void GenerateWinZoneEnter(Wall[,] field, RectZone winZone, Random random)
        {
            var fieldRect = new RectZone(0, 0, field.GetLength(1), field.GetLength(0));
            var curretPos = new Point(random.Next(winZone.Width) + winZone.Left, random.Next(winZone.Height) + winZone.Top);
            while (true)
            {
                var move = Moves[random.Next(Moves.Length)];
                var nextPos = curretPos.Move(move.Direction.X, move.Direction.Y);

                if (winZone.Contains(nextPos) == false)
                {
                    if (fieldRect.Contains(nextPos))
                        DestroyWall(field, move, curretPos, nextPos);
                    return;
                }

                curretPos = nextPos;
            }
        }

        private void DestroyWall(Wall[,] field, Move move, Point fromCell, Point toCell)
        {
            var width = field.GetLength(1);
            var height = field.GetLength(0);


            field[fromCell.Y, fromCell.X] &= (~move.FromWall);
            field[toCell.Y, toCell.X] &= (~move.ToWall);

            field[height - fromCell.Y - 1, width - fromCell.X - 1] &= (~move.ToWall);
            field[height - toCell.Y - 1, width - toCell.X - 1] &= (~move.FromWall);
        }

        protected void GenerateFarWinZoneEnter(Wall[,] field, RectZone winZone, Random random)
        {
            var fieldRect = new RectZone(0, 0, field.GetLength(1), field.GetLength(0));

            int[,] lengths = new int[fieldRect.Height, fieldRect.Width];
            Ololo(lengths, field, fieldRect, new Point(0, 0), 1);

            Move bestMove = null;
            Point? bestPos = null;
            int maxLength = 0;

            for (int y = winZone.Top; y < winZone.Top + winZone.Height; ++y)
                for (int x = winZone.Left; x < winZone.Left + winZone.Width; ++x)
                {
                    foreach (var move in Moves)
                    {
                        var l = lengths[y + move.Direction.Y, x + move.Direction.X];
                        if (l >= maxLength)
                        {
                            maxLength = l;
                            bestMove = move;
                            bestPos = new Point(x, y);
                        }
                    }
                }

            if (bestPos == null)
                throw new Exception("bestPos not found");

            DestroyWall(field, bestMove, bestPos.Value, bestPos.Value.Move(bestMove.Direction.X, bestMove.Direction.Y));
        }

        private void Ololo(int[,] lengths, Wall[,] field, RectZone fieldZone, Point pos, int length)
        {
            if (fieldZone.Contains(pos) == false || lengths[pos.Y, pos.X] != 0)
                return;

            lengths[pos.Y, pos.X] = length;

            length++;
            Wall currentWall = field[pos.Y, pos.X];
            if ((currentWall & Wall.Top) == Wall.None)
                Ololo(lengths, field, fieldZone, new Point(pos.X, pos.Y - 1), length);

            if ((currentWall & Wall.Bottom) == Wall.None)
                Ololo(lengths, field, fieldZone, new Point(pos.X, pos.Y + 1), length);

            if ((currentWall & Wall.Left) == Wall.None)
                Ololo(lengths, field, fieldZone, new Point(pos.X - 1, pos.Y), length);

            if ((currentWall & Wall.Right) == Wall.None)
                Ololo(lengths, field, fieldZone, new Point(pos.X + 1, pos.Y), length);
        }


        private class Move
        {
            public Point Direction;
            public Wall FromWall;
            public Wall ToWall;
        }
    }
}
