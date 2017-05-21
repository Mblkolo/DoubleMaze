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
        Full = Top | Right | Bottom| Left
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
            GenerateWinZoneEnter(field, winZone, random);

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

                    if (x != winZone.Width-1)
                        field[realY, realX] &= (~Wall.Right);
                }
            }
        }

        protected void GenerateWays(Wall[,] field, RectZone winZone, Random random)
        {
            var fieldRect = new RectZone(0, 0, field.GetLength(1), field.GetLength(0));
            int moveCount = (fieldRect.Width * fieldRect.Height - winZone.Width * winZone.Height - 2) / 2;

            var currentPos = new Point(0, 0);
            int count = 0;
            while (moveCount > 0)
            {
                count++;
                if (count > 100000)
                    throw new Exception("Слишком долго!");

                var o = Movies[random.Next(4)];
                var newPos = currentPos.Move(o.Direction.X, o.Direction.Y);

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
                    field[currentPos.Y, currentPos.X] &= (~o.FromWall);
                    field[newPos.Y, newPos.X] &= (~o.ToWall);

                    field[fieldRect.Height - currentPos.Y - 1, fieldRect.Width - currentPos.X - 1] &= (~o.ToWall);
                    field[fieldRect.Height - newPos.Y - 1, fieldRect.Width - newPos.X - 1] &= (~o.FromWall);

                    moveCount--;
                }
                
                currentPos = newPos;
            }

            Console.WriteLine(count);
        }

        private readonly static Move[] Movies = new[]
            {
                new Move{Direction = new Point(0, 1),  FromWall = Wall.Bottom, ToWall = Wall.Top },
                new Move{Direction = new Point(0, -1), FromWall = Wall.Top, ToWall = Wall.Bottom },
                new Move{Direction = new Point(1, 0),  FromWall = Wall.Right, ToWall = Wall.Left },
                new Move{Direction = new Point(-1, 0), FromWall = Wall.Left, ToWall = Wall.Right }
            };

        protected void GenerateWinZoneEnter(Wall[,] field, RectZone winZone, Random random)
        {
            var curretPos = new Point(random.Next(winZone.Width) + winZone.Left, random.Next(winZone.Height) + winZone.Top);
            while(true)
            {
                var move = Movies[random.Next(Movies.Length)];
                var nextPos = curretPos.Move(move.Direction.X, move.Direction.Y);

                if(winZone.Contains(nextPos) == false)
                {
                    DestroyWall(field, move, curretPos, nextPos);
                    return;
                }

                curretPos = nextPos;
            }
        }

        private void DestroyWall(Wall[,] field, Move move, Point from, Point to)
        {
            var rightCell = field.GetLength(0) - 1;
            var bottomCell = field.GetLength(1) - 1;

            field[from.Y, from.X] &= (~move.FromWall);
            field[to.Y, to.X] &= (~move.ToWall);

            field[bottomCell - from.Y, bottomCell - from.X] &= (~move.ToWall);
            field[bottomCell - to.Y, bottomCell - to.X] &= (~move.FromWall);
        }

        private class Move
        {
            public Point Direction;
            public Wall FromWall;
            public Wall ToWall;
        }
    }
}
