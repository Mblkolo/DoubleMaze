using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DoubleMaze.Game;
using DoubleMaze.Game.Bots;

namespace DoubleMaze.Storage
{
    public class InMemoryStorage : IStorage
    {
        private readonly List<PlayerStoreData> players;

        public InMemoryStorage()
        {
            players = BotDatas.Data.Select(x => CreatePlayer(x.Id, PlayerType.Bot)).ToList();
        }


        private PlayerStoreData GetPlayerOrNull(Guid playerId, PlayerType playerType)
        {
            return players.SingleOrDefault(x => x.PlayerId == playerId && x.PlayerType == playerType);
        }

        public void SavePlayer(PlayerStoreData playerStoreData)
        {
            var storedPlayer = GetPlayerOrNull(playerStoreData.PlayerId, playerStoreData.PlayerType);
            players.Remove(storedPlayer);

            players.Add(playerStoreData);
        }

        public void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerStoreData> callback)
        {
            PlayerStoreData storedPlayer = GetPlayerOrNull(playerId, playerType);
            if (storedPlayer == null)
                throw new Exception("Игрок не найден");

            ExecuteWithDelay(() => callback(storedPlayer));
        }

        private static async void ExecuteWithDelay(Action action)
        {
            await Task.Delay(1000);
            action();
        }

        private Dictionary<Guid, string> playerTokens = new Dictionary<Guid, string>();


        public async Task<bool> CheckHumanPlayerAsync(Guid playerId, string token)
        {
            await Task.Delay(1000);

            return playerTokens.ContainsKey(playerId) && playerTokens[playerId] == token;
        }

        public async Task CreateHumanPlayerAsync(Guid playerId, string token)
        {
            await Task.Delay(1000);

            playerTokens[playerId] = token;
            if (GetPlayerOrNull(playerId, PlayerType.Human) != null)
                throw new Exception("А такой игрок уже есть!");

            players.Add(CreatePlayer(playerId, PlayerType.Human));
        }

        private static PlayerStoreData CreatePlayer(Guid playerId, PlayerType playerType)
        {
            return new PlayerStoreData
            {
                PlayerId = playerId,
                IsActivated = false,
                Name = null,
                PlayerType = playerType,
                Rating = 1000
            };
        }
    }
}
