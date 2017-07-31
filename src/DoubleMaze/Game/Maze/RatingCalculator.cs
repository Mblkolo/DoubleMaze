using System;
using static System.Math;

namespace DoubleMaze.Game.Maze
{
    public class Rating
    {
        public Rating(decimal value = 1000m)
        {
            Value = value;
        }

        public decimal RoundValue => Round(Value, 1);

        public decimal Value { get; private set; }

        public static void Update(Rating ra, Rating rb, bool raWin, bool rbWin)
        {
            var raValue = ra.Value;
            var rbValue = rb.Value;

            ra.Value = Calc(raValue, rbValue, GetWinBalls(raWin, rbWin));
            rb.Value = Calc(rbValue, raValue, GetWinBalls(rbWin, raWin));
        }

        private static decimal GetWinBalls(bool raWin, bool rbWin)
        {
            if (raWin == rbWin)
                return 0.5m;

            if (raWin)
                return 1m;

            return 0m;
        }

        private static decimal Calc(decimal ra, decimal rb, decimal sa)
        {
            decimal Ea = 1 / (1 + (decimal)Pow(10, (double)(rb - ra) / 400d));

            const decimal K = 16m;
            return ra + K * (sa - Ea);
        }
    }
}
