using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public interface IMessage
    {

    }

    public class World
    {
        public BufferBlock<IMessage> InputQueue { get; private set; }
        private readonly Task mainLoop;

        public World()
        {
            InputQueue = new BufferBlock<IMessage>();
            mainLoop = MainLoop(InputQueue);
        }

        private async Task MainLoop(BufferBlock<IMessage> messages)
        {
            while (await messages.OutputAvailableAsync())
            {
                var message = await messages.ReceiveAsync();
                Console.WriteLine(message);
            }
        }
    }
}
