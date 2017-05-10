using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public class MazeField
    {
        public readonly byte[,] Field;
        public RectZone WinZone;

        public MazeField(byte[,] field, RectZone winZone)
        {
            Field = field;
            WinZone = winZone;
        }
    }

    public class MazeGenerator
    {
        public MazeField Generate(int width, int height)
        {

            var field = new MazeField(new byte[height, width], CreateWinZone(width, height));
            EraseWinZone(field);

            return field;
        }

        protected RectZone CreateWinZone(int width, int height)
        {
            var rw = 2 + width % 2;
            var rh = 2 + height % 2;
            return new RectZone((width - rw) / 2, (height - rh) / 2, rw, rh);
        }

        protected void EraseWinZone(MazeField field)
        {

        }
    }
}
