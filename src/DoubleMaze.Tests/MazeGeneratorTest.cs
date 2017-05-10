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

        public void CheckWinZoneWalls()
        {

        }
    }
}
