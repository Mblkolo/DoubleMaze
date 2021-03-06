﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using DoubleMaze.Sockets;
using DoubleMaze.Game;
using DoubleMaze.Infrastructure.Logging;
using DoubleMaze.Storage;

namespace DoubleMaze
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddJsonConsole();
            loggerFactory.AddDebug();

            app.UseWebSockets();

            //var storage = new InMemoryStorage();
            var storage = new DbStorage("Host=127.0.0.1;Username=doublemazeuser;Password=mycoolpass;Database=doublemaze");
            var world = new World(storage, loggerFactory);
            var outConnection = new OutputConnectionManager(x => world.Pipe.Post(new PlayerDisconnected(x)));
            app.Map("/test", (_app) => _app.UseMiddleware<WebSocketManagerMiddleware>(outConnection, world, storage, loggerFactory));

            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}
