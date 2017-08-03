using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure
{
    public abstract class Actor<T>
    {
        public readonly Pipe<T> Pipe = new Pipe<T>();
        private readonly ILogger logger;

        protected Actor(ILogger logger)
        {
            this.logger = logger;
        }

        public async Task Processor()
        {
            try
            {
                while (await Pipe.OutputAvailableAsync())
                {
                    await ProcessAsync(await Pipe.ReceiveAsync());
                }

                await OnFinishedAsync();
            }
            catch(Exception e)
            {
                logger.LogError(0, e, "Failed process message");
            }
        }

        protected abstract Task ProcessAsync(T item);

        protected virtual Task OnFinishedAsync()
        {
            return Task.CompletedTask;
        }

    }
}
