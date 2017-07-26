using System;
using System.Threading.Tasks;
using DoubleMaze.Game;

namespace DoubleMaze.Storage
{
    public interface IStorage
    {
        void SavePlayer(PlayerStoreData playerStoreData);
        void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerStoreData> callback);
        Task<bool> CheckHumanPlayerAsync(Guid playerId, string token);
        Task CreateHumanPlayerAsync(Guid playerId, string token);
    }
}
