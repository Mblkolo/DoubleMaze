using DoubleMaze.Infrastructure;
using System;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public class World
    {
        public Pipe<IMessage> InputQueue { get; private set; }
        private readonly Task mainLoop;
        private readonly MessageDispatcher dispatcher;

        public World()
        {
            InputQueue = new Pipe<IMessage>();
            mainLoop = MainLoop(InputQueue);
            dispatcher = new MessageDispatcher(InputQueue);
        }

        private async Task MainLoop(Pipe<IMessage> messages)
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
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
