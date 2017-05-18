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
    }
}
