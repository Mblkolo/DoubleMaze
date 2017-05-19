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
            GenerateWays(field, winZone);

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

        protected void GenerateWays(Wall[,] field, RectZone winZone)
        {
            var ololos = new[]
            {
                new {Direction = new Point(0, 1),  FromWall = Wall.Bottom, ToWall = Wall.Top },
                new {Direction = new Point(0, -1), FromWall = Wall.Top, ToWall = Wall.Bottom },
                new {Direction = new Point(1, 0),  FromWall = Wall.Right, ToWall = Wall.Left },
                new {Direction = new Point(-1, 0), FromWall = Wall.Left, ToWall = Wall.Right }
            };

            int fullCells = field.GetLength(0) * field.GetLength(1) - winZone.Width * winZone.Height;

            int rightCell = field.GetLength(1)-1;
            int bottomCell = field.GetLength(0)-1;

            var r = new Random();
            var currentPos = new Point(0, 0);
            while (fullCells > 0)
            {
                var o = ololos[r.Next(4)];
                var newPos = currentPos.Move(o.Direction.X, o.Direction.Y);

                if (newPos.X < 0 || rightCell < newPos.X ||
                    newPos.Y < 0 || bottomCell < newPos.Y)
                {
                    continue;
                }

                if (field[newPos.Y, newPos.X] == Wall.Full && winZone.Contains(currentPos) == false)
                {
                    field[currentPos.Y, currentPos.X] &= (~o.FromWall);
                    field[newPos.Y, newPos.X] &= (~o.ToWall);

                    field[bottomCell - currentPos.Y, rightCell - currentPos.X] &= (~o.ToWall);
                    field[bottomCell - newPos.Y, rightCell - newPos.X] &= (~o.FromWall);

                    fullCells -= 2;
                }
                
                currentPos = newPos;
            }
        }
    }
}
