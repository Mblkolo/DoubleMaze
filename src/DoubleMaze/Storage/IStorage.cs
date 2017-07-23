using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DoubleMaze.Game;
using DoubleMaze.Infrastructure;

namespace DoubleMaze.Storage
{
    interface IStorage
    {
        void SavePlayer(PlayerStoreData playerStoreData);
        void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerLoaded> callback);
    }
}
