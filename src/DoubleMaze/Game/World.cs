using DoubleMaze.Infrastructure;
using DoubleMaze.Storage;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Game
{
    public class World : Actor<IMessage>
    {
        private readonly MessageDispatcher dispatcher;

        public World(IStorage storage, ILoggerFactory loggetFactory)
            : base(loggetFactory.CreateLogger<World>())
        {
            dispatcher = new MessageDispatcher(new WorldState(Pipe, storage), loggetFactory);
            StartProcess();
        }

        protected override async Task Proccess()
        {
            await Loop(item => dispatcher.Process((dynamic) item));
        }
    }
}
