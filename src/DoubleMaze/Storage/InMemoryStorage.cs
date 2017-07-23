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
        private List<PlayerStoreData> players = new List<PlayerStoreData>();

        private PlayerStoreData SingleOrDefault(Guid id, PlayerType playerType)
        {
            return players.SingleOrDefault(x => x.Id == id && x.PlayerType == playerType);
        }

        public void SavePlayer(PlayerStoreData playerStoreData)
        {
            var storedPlayer = SingleOrDefault(playerStoreData.Id, playerStoreData.PlayerType);
            players.Remove(storedPlayer);

            players.Add(playerStoreData);
        }

        public void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerLoaded> callback)
        {
            var storedPlayer = SingleOrDefault(playerId, playerType);
            if (storedPlayer == null)
                storedPlayer = new PlayerStoreData
                {
                    Id = playerId,
                    IsActivated = false,
                    Name = null,
                    PlayerType = playerType,
                    Rating = new Game.Maze.Rating()
                };

            callback(new PlayerLoaded(storedPlayer));
        }
       
    }
}
