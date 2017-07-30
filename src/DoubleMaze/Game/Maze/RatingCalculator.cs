using System;
using static System.Math;

namespace DoubleMaze.Game.Maze
{
    public class Rating
    {
        public Rating(double value = 1000d)
        {
            Value = value;
        }

        public double RoundValue => Round(Value, 1);

        public double Value { get; private set; }

        public static void Update(Rating ra, Rating rb, bool raWin, bool rbWin)
        {
            var raValue = ra.Value;
            var rbValue = rb.Value;

            ra.Value = Calc(raValue, rbValue, GetWinBalls(raWin, rbWin));
            rb.Value = Calc(rbValue, raValue, GetWinBalls(rbWin, raWin));
        }

        private static double GetWinBalls(bool raWin, bool rbWin)
        {
            if (raWin == rbWin)
                return 0.5d;

            if (raWin)
                return 1d;

            return 0d;
        }

        private static double Calc(double ra, double rb, double sa)
        {
            double Ea = 1 / (1 + Pow(10, (rb - ra) / 400d));

            const double K = 16d;
            return ra + K * (sa - Ea);
        }
    }
}
