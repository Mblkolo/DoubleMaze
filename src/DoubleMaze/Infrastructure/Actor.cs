using System;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure
{
    public abstract class Actor<T>
    {
        public readonly Pipe<T> Pipe = new Pipe<T>();

        private readonly ILogger logger;
        private Task processedTask;

        protected Actor(ILogger logger)
        {
            this.logger = logger;
        }

        protected void StartProcess()
        {
            processedTask = ExecuteWithLogging();
        }

        private async Task ExecuteWithLogging()
        {
            try
            {
                await Proccess();
            }
            catch(Exception e)
            {
                logger.LogError(0, e, "Failed process message");
            }
        }

        protected abstract Task Proccess();


        protected async Task LoopAsync(Func<T, Task> action)
        {
            while (await Pipe.OutputAvailableAsync())
            {
                await action(await Pipe.ReceiveAsync());
            }
        }

        protected async Task Loop(Action<T> action)
        {
            while (await Pipe.OutputAvailableAsync())
            {
                action(await Pipe.ReceiveAsync());
            }
        }
    }
}
