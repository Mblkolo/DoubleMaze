using SimpleMigrations;
using System;

namespace DoubleMaze.Migrations.Migrations
{
    [Migration(20170727232700)]
    public class Migration20170727_232700 : Migration
    {
        protected override void Down()
        {
            throw new NotImplementedException();
        }

        protected override void Up()
        {
            Execute(@"
                CREATE TABLE public.ratings
                (
                    id numeric NOT NULL,
                    rating double precision NOT NULL,
                    PRIMARY KEY (id)
                )
                WITH (
                    OIDS = FALSE
                )
                TABLESPACE pg_default;

                ALTER TABLE public.ratings
                    OWNER to doublemazeuser;
            ");
        }
    }
}
