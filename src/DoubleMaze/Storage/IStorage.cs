using System;
using DoubleMaze.Game;

namespace DoubleMaze.Storage
{
    interface IStorage
    {
        void SavePlayer(PlayerStoreData playerStoreData);
        void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerStoreData> callback);
    }
}
