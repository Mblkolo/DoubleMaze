using SimpleMigrations;
using System;

namespace DoubleMaze.Migrations.Migrations
{
    [Migration(20170730231700)]
    public class Migration20170730_231700 : Migration
    {
        protected override void Down()
        {
            throw new NotImplementedException();
        }

        protected override void Up()
        {
            Execute(@"ALTER TABLE users ADD COLUMN rating numeric");

            Execute(@"UPDATE users SET rating=1000");

            Execute(@"ALTER TABLE users ALTER COLUMN rating SET NOT NULL");

            Execute(@"ALTER TABLE users ALTER COLUMN id TYPE integer");
        }
    }
}
