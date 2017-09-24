using DoubleMaze.Game.Maze;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Tests
{
    [TestFixture]
    public class EloRatingTest
    {
        [Test]
        public void EloRatingNoChangeWhenDraw()
        {
            var rating1 = new Rating();
            var rating2 = new Rating();

            Rating.Update(rating1, rating2, false, false);

            Assert.That(rating1.Value, Is.EqualTo(1000d).Within(0.00001));
            Assert.That(rating2.Value, Is.EqualTo(1000d).Within(0.00001));
        }

        [Test]
        public void EloRatingGotoAvergateWhenDraw()
        {
            var rating1 = new Rating(1008);
            var rating2 = new Rating(992);

            Rating.Update(rating1, rating2, false, false);

            Assert.That(rating1.Value, Is.LessThan(1008d));
            Assert.That(rating2.Value, Is.GreaterThan(992d));
        }

        [Test]
        public void EloRatingNoChangeWhenDraw2()
        {
            var rating1 = new Rating();
            var rating2 = new Rating();

            Rating.Update(rating1, rating2, true, true);

            Assert.That(rating1.Value, Is.EqualTo(1000d).Within(0.00001));
            Assert.That(rating2.Value, Is.EqualTo(1000d).Within(0.00001));
        }

        [TestCase(1000d, 1000d)]
        [TestCase(0d, 1000d)]
        [TestCase(1000d, 0d)]
        [TestCase(2000, 1000)]
        [TestCase(1000, 2000)]
        public void EloRatingSumNoChange(decimal rating1Value, decimal rating2Value)
        {
            var rating1 = new Rating(rating1Value);
            var rating2 = new Rating(rating2Value);

            Rating.Update(rating1, rating2, true, false);

            Assert.That(rating1.Value + rating2.Value, Is.EqualTo(rating1Value + rating2Value).Within(0.00001));
        }
    }
}
