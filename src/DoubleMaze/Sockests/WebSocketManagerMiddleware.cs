using DoubleMaze.Game;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
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
            PlayerConnection playerConnection = null;
            try
            {
                playerConnection = await LoginPlayer(socket);
                await Receive(socket, playerConnection);
            }
            finally
            {
                if (playerConnection != null)
                    _outConnectionManager.ConnectionClosed(playerConnection.ConnectionId);
            }

            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            //await _next.Invoke(context);
        }

        private async Task<PlayerConnection> LoginPlayer(WebSocket socket)
        {
            byte[] buffer = new byte[1024 * 4];

            var input = await socket.ReadInputAsync(buffer);
            var loginInput = input as TokenInput;
            if (loginInput == null)
                throw new Exception($"Это не {nameof(TokenInput)}");

            PlayerConnection playerConnection = _outConnectionManager.PlayerConnected(loginInput.Token, socket);
            await socket.SendDataAsync(new SetTokenCommand { token = playerConnection.PlayerId.ToString("N") });

            return playerConnection;
        }

        private async Task Receive(WebSocket socket, PlayerConnection playerConnection)
        {
            byte[] buffer = new byte[1024 * 4];

            _world.InputQueue.Post(new PlayerConnected(playerConnection.PlayerId, playerConnection.OutputChanel.InputQueue));
            while (socket.State == WebSocketState.Open)
            {
                var input = await socket.ReadInputAsync(buffer);
                _world.InputQueue.Post(new PlayerInput(playerConnection.PlayerId, input));
            }
        }
    }

    public class PlayerConnection
    {
        public Guid ConnectionId { get; }
        public OutputChanel OutputChanel { get; }
        public Guid PlayerId { get; }
        public WebSocket WebSocket { get; }

        public PlayerConnection(Guid playerId, WebSocket socket)
        {
            PlayerId = playerId;

            ConnectionId = Guid.NewGuid();
            OutputChanel = new OutputChanel(socket);
            WebSocket = socket;
        }

    }

    public class OutputConnectionManager
    {
        private object Locker = new object();
        private List<PlayerConnection> PlayerConnections = new List<PlayerConnection>();
        private Dictionary<Guid, Timer> TimeoutTimers = new Dictionary<Guid, Timer>();

        private Action<Guid> playerDisconnected;

        public OutputConnectionManager(Action<Guid> playerDisconnected)
        {
            this.playerDisconnected = playerDisconnected;
        }

        internal PlayerConnection PlayerConnected(string tokenString, WebSocket socket)
        {
            lock(Locker)
            {
                Guid playerId;
                if (Guid.TryParse(tokenString, out playerId) == false)
                    playerId = Guid.NewGuid();

                foreach(var connection in PlayerConnections.Where(x => x.PlayerId == playerId).ToArray())
                    RemoveConnection(connection);

                var newConnection = new PlayerConnection(playerId, socket);
                PlayerConnections.Add(newConnection);
                
                DisploseAndRemoveTimer(playerId);

                return newConnection;
            }
        }
        
        private void RemoveConnection(PlayerConnection connection)
        {
            connection.OutputChanel.InputQueue.Complete();
            PlayerConnections.Remove(connection);
        }

        internal void ConnectionClosed(Guid connectionId)
        {
            lock (Locker)
            {
                var connection = PlayerConnections.Where(x => x.ConnectionId == connectionId).SingleOrDefault();
                if (connection == null)
                    return;

                RemoveConnection(connection);

                var timer = new Timer(TimeoutPlayer, connection.PlayerId, TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
                TimeoutTimers.Add(connection.PlayerId, timer);
            }
        }

        private void TimeoutPlayer(object playerIdObject)
        {
            Guid playerId = (Guid)playerIdObject;
            lock (Locker)
            {
                if (TimeoutTimers.ContainsKey(playerId) == false)
                    return;

                DisploseAndRemoveTimer(playerId);
                playerDisconnected(playerId);
            }
        }

        private void DisploseAndRemoveTimer(Guid playerId)
        {
            if(TimeoutTimers.ContainsKey(playerId))
            {
                TimeoutTimers[playerId].Dispose();
                TimeoutTimers.Remove(playerId);
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
            try
            {
                while (await messages.OutputAvailableAsync())
                {
                    IGameCommand data = await messages.ReceiveAsync();

                    await socket.SendDataAsync(data);
                }
                Console.WriteLine("Игрок отключился");
                await socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "Да нормально всё!", CancellationToken.None);
            }
            catch(Exception e)
            {
                throw;
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
            byte[] bytes = Encoding.UTF8.GetBytes(message);
            await socket.SendAsync(buffer: new ArraySegment<byte>(array: bytes,
                                                                  offset: 0,
                                                                  count: bytes.Length),
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

            if (checker.Type == InputType.PlayAgain)
                return JsonConvert.DeserializeObject<PlayAgainInput>(message);

            if (checker.Type == InputType.ResetPlayer)
                return JsonConvert.DeserializeObject<ResetPlayerInput>(message);

            throw new NotImplementedException();
        }

        private class CheckType : IPlayerInput
        {
            public InputType Type { get; set; }
        }
    }
}
