using SimpleMigrations;
using System;

namespace DoubleMaze.Migrations.Migrations
{
    [Migration(20170730181700)]
    public class Migration20170730_181700 : Migration
    {
        protected override void Down()
        {
            throw new NotImplementedException();
        }

        protected override void Up()
        {
            Execute(@"CREATE SEQUENCE users_sequence");
        }
    }

    [Migration(20170730181701)]
    public class Migration20170730_181701 : Migration
    {
        protected override void Down()
        {
            throw new NotImplementedException();
        }

        protected override void Up()
        {
            Execute(@"
                CREATE TABLE users
                (
                    id numeric NOT NULL DEFAULT nextval('users_sequence'),
                    name text,
                    is_activated boolean NOT NULL,
                    player_type text,
                    player_id uuid NOT NULL,
                    payload jsonb NOT NULL,
                    CONSTRAINT pk_users_id PRIMARY KEY (id),
                    CONSTRAINT uk_users_player_type UNIQUE (player_id, player_type)
                )
            ");
        }
    }
}
