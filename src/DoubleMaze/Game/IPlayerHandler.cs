using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public interface IPlayerHandler
    {
        void Process(IPlayerInput inputCommand);
    }
}
