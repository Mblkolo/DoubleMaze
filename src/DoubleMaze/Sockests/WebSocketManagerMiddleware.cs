using DoubleMaze.Game;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Sockests
{
    public class WebSocketManagerMiddleware
    {
        private readonly RequestDelegate _next;
        private OutputConnectionManager _outConnectionManager { get; set; }
        private World _world{ get; set; }

        public WebSocketManagerMiddleware(RequestDelegate next, OutputConnectionManager outConnectionManager, World world)
        {
            _next = next;
            _outConnectionManager = outConnectionManager;
            _world = world;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
                return;

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            await Receive(socket);

            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            //await _next.Invoke(context);
        }

        private async Task Receive(WebSocket socket)
        {
            byte[] buffer = new byte[1024 * 4];

            var input = await socket.ReadInputAsync(buffer);
            var loginInput = input as TokenInput;
            if (loginInput == null)
                throw new Exception($"Это не {nameof(TokenInput)}");

            Guid playerId = _outConnectionManager.PlayerConnected(loginInput.Token, socket);
            await socket.SendDataAsync(new SetTokenCommand { token = playerId.ToString("N") });

            _world.InputQueue.Post(new PlayerConnected(playerId, _outConnectionManager.GetQueue(playerId)));
            while (socket.State == WebSocketState.Open)
            {
                input = await socket.ReadInputAsync(buffer);
                _world.InputQueue.Post(new PlayerInput(playerId, input));
            }
        }
    }

    public class OutputConnectionManager
    {
        private object Locker = new object();
        private Dictionary<Guid, OutputChanel> PlayerChanals = new Dictionary<Guid, OutputChanel>();


        internal BufferBlock<IGameCommand> GetQueue(Guid playerId)
        {
            lock (Locker)
            {
                return PlayerChanals[playerId].InputQueue;
            }
        }

        internal Guid PlayerConnected(string login, WebSocket socket)
        {
            lock(Locker)
            {
                Guid playerId;
                if (Guid.TryParse(login, out playerId) == false)
                    playerId = Guid.NewGuid();

                if (PlayerChanals.ContainsKey(playerId))
                {
                    PlayerChanals[playerId].SetSocket(socket);
                }
                else
                {
                    playerId = Guid.NewGuid();
                    PlayerChanals[playerId] = new OutputChanel(socket);
                }

                return playerId;
            }
        }
    }

    public class OutputChanel
    {
        public readonly BufferBlock<IGameCommand> InputQueue;
        private readonly Task mainLoop;
        private volatile WebSocket socket;

        public OutputChanel(WebSocket socket)
        {
            this.socket = socket;
            InputQueue = new BufferBlock<IGameCommand>();
            mainLoop = MainLoop(InputQueue);
        }

        internal void SetSocket(WebSocket socket)
        {
            this.socket = socket;
        }

        private async Task MainLoop(BufferBlock<IGameCommand> messages)
        {
            while (await messages.OutputAvailableAsync())
            {
                var data = await messages.ReceiveAsync();

                await socket.SendDataAsync(data);
            }
        }



    }

    public static class WebSocketIoExtensions
    {
        public static async Task SendDataAsync(this WebSocket socket, IGameCommand data)
        {
            if (socket.State != WebSocketState.Open)
                return;

            var message = JsonConvert.SerializeObject(data);
            await socket.SendAsync(buffer: new ArraySegment<byte>(array: Encoding.UTF8.GetBytes(message),
                                                                  offset: 0,
                                                                  count: message.Length),
                                   messageType: WebSocketMessageType.Text,
                                   endOfMessage: true,
                                   cancellationToken: CancellationToken.None);
        }


        public static async Task<IPlayerInput> ReadInputAsync(this WebSocket socket, byte[] buffer)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.EndOfMessage == false)
                throw new Exception("Слишком длинное сообщение");

            if (result.MessageType != WebSocketMessageType.Text)
                throw new Exception("Это сообщение не текст");

            return DecodeMessage(Encoding.UTF8.GetString(buffer, 0, result.Count));
        }

        private static IPlayerInput DecodeMessage(string message)
        {
            //Быстро и грязно
            //TODO переписать по человечески
            var checker = JsonConvert.DeserializeObject<CheckType>(message);
            if (checker.Type == InputType.PlayerName)
                return JsonConvert.DeserializeObject<PlayerNameInput>(message);

            if (checker.Type == InputType.KeyDown)
                return JsonConvert.DeserializeObject<KeyDownInput>(message);

            if (checker.Type == InputType.Token)
                return JsonConvert.DeserializeObject<TokenInput>(message);

            throw new NotImplementedException();
        }

        private class CheckType : IPlayerInput
        {
            public InputType Type { get; set; }
        }
    }
}
