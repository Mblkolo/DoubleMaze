using DoubleMaze.Game;
using DoubleMaze.Infrastructure;
using DoubleMaze.Util;
using Microsoft.Extensions.Logging;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace DoubleMaze.Sockets
{
    public class OutputChanel : Actor<IGameCommand>
    {
        private readonly WebSocket socket;

        public OutputChanel(WebSocket socket, ILoggerFactory factory)
            : base(factory.CreateLogger<OutputChanel>())
        {
            this.socket = socket;
            StartProcess();
        }

        protected override async Task Proccess()
        {
            await LoopAsync(async x => await socket.SendDataAsync(x));
            await socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "Да нормально всё!", CancellationToken.None);

        }
    }
}
