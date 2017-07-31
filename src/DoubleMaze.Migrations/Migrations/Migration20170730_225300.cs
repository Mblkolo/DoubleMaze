using SimpleMigrations;
using System;

namespace DoubleMaze.Migrations.Migrations
{
    [Migration(20170730225300)]
    public class Migration20170730_225300 : Migration
    {
        protected override void Down()
        {
            throw new NotImplementedException();
        }

        protected override void Up()
        {
            Execute(@"INSERT INTO users(is_activated, player_id, name, player_type, payload)
                        VALUES (true, '{C3A3051C-7B2B-45BC-957E-8F3E16DFB781}', 'Бот 5', 'Bot', '{}')");

            Execute(@"INSERT INTO users(is_activated, player_id, name, player_type, payload)
                        VALUES (true, '{A12C8DA7-27A5-4110-93B7-509F66FF24F9}', 'Бот 9', 'Bot', '{}')");

            Execute(@"INSERT INTO users(is_activated, player_id, name, player_type, payload)
                        VALUES (true, '{A77875EB-8DEB-43DD-8F8F-5E8857A5DCAA}', 'Бот 13', 'Bot', '{}')");

            Execute(@"INSERT INTO users(is_activated, player_id, name, player_type, payload)
                        VALUES (true, '{C851CCDA-1D26-4635-9C4B-38F691C9D92B}', 'Бот 17', 'Bot', '{}')");

            Execute(@"INSERT INTO users(is_activated, player_id, name, player_type, payload)
                        VALUES (true, '{91EF007C-CE90-45F3-BB92-C77C1C30A3D0}', 'Бот 21', 'Bot', '{}')");

        }
    }
}
