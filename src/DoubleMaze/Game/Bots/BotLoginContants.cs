using System;

namespace DoubleMaze.Game.Bots
{
    public static class BotDatas
    {
        public static BotData[] Data =
        {
            new BotData(Guid.NewGuid(), 5),
            new BotData(Guid.NewGuid(), 9),
            new BotData(Guid.NewGuid(), 13),
            new BotData(Guid.NewGuid(), 17),
            new BotData(Guid.NewGuid(), 21),
        };

        public class BotData
        {
            public readonly Guid Id;
            public readonly int Depth;

            public BotData(Guid id, int depth)
            {
                Id = id;
                Depth = depth;
            }
        }
    }
}
