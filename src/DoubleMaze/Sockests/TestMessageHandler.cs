using System;
using System.Collections.Generic;
using System.Text;
using System.Net.WebSockets;
using System.Threading.Tasks;
using DoubleMaze.Game;
using Newtonsoft.Json;

namespace DoubleMaze.Sockests
{
    public class TestMessageHandler : WebSocketHandler
    {
        private SimpleMaze simpleMaze;

        public TestMessageHandler(WebSocketConnectionManager webSocketConnectionManager) 
            : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);

            simpleMaze = new SimpleMaze(async gs => {
                await SendMessageAsync(socket, JsonConvert.SerializeObject(gs) );
            });

            var socketId = WebSocketConnectionManager.GetId(socket);
            await SendMessageToAllAsync($"{socketId} is now connected");
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);
            //var message = $"{socketId} said: {Encoding.UTF8.GetString(buffer, 0, result.Count)}";
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            //await SendMessageToAllAsync(message);

            simpleMaze.Execute(JsonConvert.DeserializeObject<InputCommand>(message));
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);

            await base.OnDisconnected(socket);
            await SendMessageToAllAsync($"{socketId} disconnected");
        }
    }
}
