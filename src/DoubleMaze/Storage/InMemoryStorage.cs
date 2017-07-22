using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DoubleMaze.Game;
using DoubleMaze.Infrastructure;

namespace DoubleMaze.Storage
{
    public class InMemoryStorage : IStorage
    {
        public void LoadPlayer(Guid playerId, Pipe<IMessage> inputQueue)
        {
            throw new NotImplementedException();
        }

        public void SavePlayer(PlayerStoreData playerStoreData)
        {
            throw new NotImplementedException();
        }
    }
}
