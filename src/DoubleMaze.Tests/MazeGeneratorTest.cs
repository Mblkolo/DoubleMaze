using DoubleMaze.Game;
using NUnit.Framework;

namespace DoubleMaze.Tests
{
    [TestFixture]
    public class MazeGeneratorTest
    {
        private class MazeGeneratorMock : MazeGenerator
        {
            public RectZone CreateWinZoneWrapper(int width, int height)
            {
                return CreateWinZone(width, height);
            }

            public Wall[,] CreateFieldWrapper(int width, int height)
            {
                return CreateField(width, height);
            }

            public void EraseWinZoneWrapper(Wall[,] field, RectZone winZone)
            {
                EraseWinZone(field, winZone);
            }
        }

        [TestCase(2, 2, 0, 0, 2, 2)]
        [TestCase(3, 2, 0, 0, 3, 2)]
        [TestCase(2, 3, 0, 0, 2, 3)]
        [TestCase(3, 3, 0, 0, 3, 3)]
        [TestCase(4, 5, 1, 1, 2, 3)]
        public void CreateMazeFieldWinZone(int width, int height, int rl, int rt, int rw, int rh)
        {
            var winZone = new MazeGeneratorMock().CreateWinZoneWrapper(width, height);
            Assert.That(winZone, Is.EqualTo(new RectZone(rl, rt, rw, rh)));
        }

        [TestCase(2, 2, 0, 0, 2, 2)]
        [TestCase(3, 2, 0, 0, 3, 2)]
        [TestCase(2, 3, 0, 0, 2, 3)]
        [TestCase(3, 3, 0, 0, 3, 3)]
        [TestCase(4, 5, 1, 1, 2, 3)]
        public void CheckWinZoneWalls(int width, int height, int left, int top, int rw, int rh)
        {
            var mazeGenerator = new MazeGeneratorMock();
            var field = mazeGenerator.CreateFieldWrapper(width, height);

            mazeGenerator.EraseWinZoneWrapper(field, new RectZone(left, top, rw, rh));

            var bottom = top + rh - 1;
            var right = left + rw - 1;

            Assert.That(field[top, left], Is.EqualTo(Wall.Top | Wall.Left));
            Assert.That(field[top, right], Is.EqualTo(Wall.Top | Wall.Right));
            Assert.That(field[bottom, right], Is.EqualTo(Wall.Bottom | Wall.Right));
            Assert.That(field[bottom, left], Is.EqualTo(Wall.Bottom | Wall.Left));

            for(int x = 1; x < rw - 1; ++x)
            {
                Assert.That(field[top, left + x], Is.EqualTo(Wall.Top));
                Assert.That(field[bottom, left + x], Is.EqualTo(Wall.Bottom));
            }

            for (int y = 1; y < rh - 1; ++y)
            {
                Assert.That(field[top + y, left], Is.EqualTo(Wall.Left));
                Assert.That(field[top + y, right], Is.EqualTo(Wall.Right));
            }

            for (int x = 1; x < rw - 1; ++x)
                for (int y = 1; y < rh - 1; ++y)
                    Assert.That(field[top + y, left+x], Is.EqualTo(Wall.None));
        }
    }
}
