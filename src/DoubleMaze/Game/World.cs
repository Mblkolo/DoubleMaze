using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public class World
    {
        public BufferBlock<IMessage> InputQueue { get; private set; }
        private readonly Task mainLoop;
        private readonly MessageDispatcher dispatcher;

        public World()
        {
            InputQueue = new BufferBlock<IMessage>();
            mainLoop = MainLoop(InputQueue);
            dispatcher = new MessageDispatcher(InputQueue);
        }

        private async Task MainLoop(BufferBlock<IMessage> messages)
        {
            try
            {
                while (await messages.OutputAvailableAsync())
                {
                    var message = await messages.ReceiveAsync();
                    (dispatcher).Process((dynamic)message);
                }
            }
            catch(Exception e)
            {
                throw;
            }
        }
    }
}
