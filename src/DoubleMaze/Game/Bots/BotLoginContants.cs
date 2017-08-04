using System;

namespace DoubleMaze.Game.Bots
{
    public static class BotDatas
    {
        public static BotData[] Data =
        {
            new BotData(Guid.Parse("{C3A3051C-7B2B-45BC-957E-8F3E16DFB781}"), 5),
            new BotData(Guid.Parse("{A12C8DA7-27A5-4110-93B7-509F66FF24F9}"), 9),
            new BotData(Guid.Parse("{A77875EB-8DEB-43DD-8F8F-5E8857A5DCAA}"), 13),
            new BotData(Guid.Parse("{C851CCDA-1D26-4635-9C4B-38F691C9D92B}"), 17),
            new BotData(Guid.Parse("{91EF007C-CE90-45F3-BB92-C77C1C30A3D0}"), 21),
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
