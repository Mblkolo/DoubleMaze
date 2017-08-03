using DoubleMaze.Game;
using DoubleMaze.Infrastructure;
using DoubleMaze.Util;
using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace DoubleMaze.Sockets
{
    public class OutputChanel
    {
        public readonly Pipe<IGameCommand> InputQueue;
        private readonly Task mainLoop;
        private volatile WebSocket socket;

        public OutputChanel(WebSocket socket)
        {
            this.socket = socket;
            InputQueue = new Pipe<IGameCommand>();
            mainLoop = MainLoop(InputQueue);
        }

        internal void SetSocket(WebSocket socket)
        {
            this.socket = socket;
        }

        private async Task MainLoop(Pipe<IGameCommand> messages)
        {
            try
            {
                while (await messages.OutputAvailableAsync())
                {
                    IGameCommand data = await messages.ReceiveAsync();

                    await socket.SendDataAsync(data);
                }
                //Console.WriteLine("Игрок отключился");
                await socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "Да нормально всё!", CancellationToken.None);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
