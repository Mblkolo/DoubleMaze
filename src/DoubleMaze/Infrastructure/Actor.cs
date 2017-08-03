using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure
{
    public abstract class Actor<T>
    {
        public readonly Pipe<T> Pipe = new Pipe<T>();

        protected Actor(ILoggerFactory logerFactory)
        {
            logerFactory.CreateLogger(GetType());
        }

        public async Task Processor()
        {
            while (await Pipe.OutputAvailableAsync())
            {
                await ProcessAsync(await Pipe.ReceiveAsync());
            }
        }

        public abstract Task ProcessAsync(T item);
    }
}
