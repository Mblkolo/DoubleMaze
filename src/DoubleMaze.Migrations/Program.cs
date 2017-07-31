using Npgsql;
using SimpleMigrations;
using SimpleMigrations.DatabaseProvider;
using System.Reflection;

namespace DoubleMaze.Migrations
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var migrationsAssembly = Assembly.GetEntryAssembly();

            using (var connection = new NpgsqlConnection("Host=127.0.0.1;Username=doublemazeuser;Password=mycoolpass;Database=doublemaze"))
            {
                var databaseProvider = new PostgresqlDatabaseProvider(connection);
                var migrator = new SimpleMigrator(migrationsAssembly, databaseProvider);
                migrator.Load();

                    migrator.MigrateToLatest();
            }
        }
    }
}
