using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DoubleMaze.Game;
using System.Data;
using Dapper;

namespace DoubleMaze.Storage
{
    public class DbStorage : IStorage
    {
        private readonly string connectionString;

        public DbStorage(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<bool> CheckHumanPlayerAsync(Guid playerId, string token)
        {
            using (IDbConnection con = new Npgsql.NpgsqlConnection(connectionString))
            {
                return await con.ExecuteScalarAsync<bool>("SELECT EXISTS (SELECT * FROM users WHERE player_id=@playerId AND payload ->> 'token'=@token)", new { playerId, token });
            }
        }

        public async Task CreateHumanPlayerAsync(Guid playerId, string token)
        {
            using (IDbConnection con = new Npgsql.NpgsqlConnection(connectionString))
            {
                await con.ExecuteScalarAsync<bool>(
                    @"INSERT INTO users(is_activated, player_id, player_type, rating, payload)
                        VALUES (false, @playerId, @playerType, @rating, @payload::jsonb)",
                    new
                    {
                        playerId,
                        token,
                        rating = 1000,
                        playerType = PlayerType.Human.ToString(),
                        payload = $@"{{""token"": ""{token}""}}"
                    });
            }
        }

        public void LoadPlayer(Guid playerId, PlayerType playerType, Action<PlayerStoreData> callback)
        {
            Task.Run(() =>
            {
                using (IDbConnection con = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var playerDatas = con.Query<PlayerStoreData>(
                        "SELECT * FROM users WHERE player_id=@playerId AND player_type=@playerType",
                        new { playerId, playerType = playerType.ToString() });

                    callback(playerDatas.Single());
                }
            });
        }

        public void SavePlayer(PlayerStoreData playerStoreData)
        {
            Task.Run(() =>
            {
                using (IDbConnection con = new Npgsql.NpgsqlConnection(connectionString))
                {
                    con.ExecuteScalar<PlayerStoreData>(
                        @"UPDATE users SET name=@Name, is_activated = @isActivated, rating=@rating
                            WHERE player_id=@playerId AND player_type=@playerTypeString", playerStoreData);
                }
            });
        }
    }
}
