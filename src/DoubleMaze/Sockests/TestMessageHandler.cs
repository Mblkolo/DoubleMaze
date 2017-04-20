using System;
using System.Collections.Generic;
using System.Text;
using System.Net.WebSockets;
using System.Threading.Tasks;
using DoubleMaze.Game;
using Newtonsoft.Json;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Sockests
{
    public class TestMessageHandler : WebSocketHandler
    {
        private SimpleMaze simpleMaze;

        private World world;

        public TestMessageHandler(WebSocketConnectionManager webSocketConnectionManager) 
            : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);

            //simpleMaze = new SimpleMaze(async gs => {
            //    await SendMessageAsync(socket, JsonConvert.SerializeObject(gs) );
            //});
            var socketId = WebSocketConnectionManager.GetId(socket);

            var output = new OutputChanel(async gs => {
                await SendMessageAsync(socket, JsonConvert.SerializeObject(gs));
            });

            world = new World();
            world.InputQueue.Post(new NewConnection(new Guid(socketId), output.InputQueue));
        }

        public class OutputChanel
        {
            public BufferBlock<object> InputQueue { get; private set; }
            private readonly Task mainLoop;
            private Func<object, Task> callback;

            public OutputChanel(Func<object, Task> callback)
            {
                this.callback = callback;
                InputQueue = new BufferBlock<object>();
                mainLoop = MainLoop(InputQueue);
            }

            private async Task MainLoop(BufferBlock<object> messages)
            {
                while (await messages.OutputAvailableAsync())
                {
                    var message = await messages.ReceiveAsync();
                    await callback(message);
                }
            }
        }
        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);
            //var message = $"{socketId} said: {Encoding.UTF8.GetString(buffer, 0, result.Count)}";
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            //await SendMessageToAllAsync(message);

            //simpleMaze.Execute(JsonConvert.DeserializeObject<InputCommand>(message));
            world.InputQueue.Post(new PlayerInput(new Guid(WebSocketConnectionManager.GetId(socket)), message) );
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);

            await base.OnDisconnected(socket);
            await SendMessageToAllAsync($"{socketId} disconnected");
        }

        private class TextMessage : IMessage
        {
            public string Text;

            public override string ToString()
            {
                return Text;
            }
        }
    }
}
