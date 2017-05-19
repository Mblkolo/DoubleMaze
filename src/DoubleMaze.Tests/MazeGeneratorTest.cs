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

            public void GenerateWaysWrapper(Wall[,] field, RectZone winZone)
            {
                GenerateWays(field, winZone);
            }
        }

        [TestCaseSource(nameof(Source))]
        public void CreateMazeFieldWinZone(int width, int height, int rl, int rt, int rw, int rh)
        {
            var winZone = new MazeGeneratorMock().CreateWinZoneWrapper(width, height);
            Assert.That(winZone, Is.EqualTo(new RectZone(rl, rt, rw, rh)));
        }

        [TestCaseSource(nameof(Source))]
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

            for (int x = 1; x < rw - 1; ++x)
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
                    Assert.That(field[top + y, left + x], Is.EqualTo(Wall.None));
        }

        [TestCaseSource(nameof(Source))]
        public void CheckSymmetry(int width, int height, int left, int top, int rw, int rh)
        {
            var mazeGenerator = new MazeGeneratorMock();
            var field = mazeGenerator.CreateFieldWrapper(width, height);

            var winZone = new RectZone(left, top, rw, rh);
            mazeGenerator.GenerateWaysWrapper(field, winZone);

            for (int y = 0; y < height; ++y)
                for (int x = 0; x < width; ++x)
                {
                    Wall cell = field[y, x];

                    if(winZone.Contains(new Point(x, y)) == false)
                        Assert.That(cell, Is.Not.EqualTo(Wall.Full));

                    Wall symmetryCell = field[height - y - 1, width - x - 1];

                    if((cell & Wall.Top) == Wall.Top && (symmetryCell & Wall.Bottom) == Wall.Bottom)
                        Assert.That(symmetryCell & Wall.Bottom, Is.EqualTo(Wall.Bottom));
                    else
                        Assert.That(symmetryCell & Wall.Bottom, Is.EqualTo(Wall.None));

                    if ((cell & Wall.Bottom) == Wall.Bottom)
                        Assert.That(symmetryCell & Wall.Top, Is.EqualTo(Wall.Top));
                    else
                        Assert.That(symmetryCell & Wall.Top, Is.EqualTo(Wall.None));

                    if ((cell & Wall.Left) == Wall.Left)
                        Assert.That(symmetryCell & Wall.Right, Is.EqualTo(Wall.Right));
                    else
                        Assert.That(symmetryCell & Wall.Right, Is.EqualTo(Wall.None));

                    if ((cell & Wall.Right) == Wall.Right)
                        Assert.That(symmetryCell & Wall.Left, Is.EqualTo(Wall.Left));
                    else
                        Assert.That(symmetryCell & Wall.Left, Is.EqualTo(Wall.None));
                }
        }

        public static object[] Source = new[]
        {
            new []{ 2, 2, 0, 0, 2, 2 },
            new []{ 3, 2, 0, 0, 3, 2 },
            new []{ 2, 3, 0, 0, 2, 3 },
            new []{ 3, 3, 0, 0, 3, 3 },
            new []{ 4, 5, 1, 1, 2, 3 },
            new []{ 40, 50, 19, 24, 2, 2 }
        };

    }
}
