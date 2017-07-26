using DoubleMaze.Game;
using DoubleMaze.Storage;
using DoubleMaze.Util;
using Microsoft.AspNetCore.Http;
using System;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace DoubleMaze.Sockets
{
    public class WebSocketManagerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly OutputConnectionManager _outConnectionManager;
        private readonly World _world;
        private readonly IStorage _storage;

        public WebSocketManagerMiddleware(RequestDelegate next, OutputConnectionManager outConnectionManager, World world, IStorage storage)
        {
            _next = next;
            _outConnectionManager = outConnectionManager;
            _world = world;
            _storage = storage;
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

            var playerId = loginInput.PlayerId;
            var token = loginInput.Token;

            if (playerId == null || await _storage.CheckHumanPlayerAsync(playerId.Value, token) == false) {
                playerId = Guid.NewGuid();
                token = Guid.NewGuid().ToString("N");

                await _storage.CreateHumanPlayerAsync(playerId.Value, token);
            }

            PlayerConnection playerConnection = _outConnectionManager.PlayerConnected(playerId.Value, socket);

            await socket.SendDataAsync(new SetTokenCommand { playerId = playerId.Value.ToString("N"), token = token });

            return playerConnection;
        }

        private async Task Receive(WebSocket socket, PlayerConnection playerConnection)
        {
            byte[] buffer = new byte[1024 * 4];

            _world.InputQueue.Post(new PlayerConnected(playerConnection.PlayerId, playerConnection.OutputChanel.InputQueue, PlayerType.Human));
            while (socket.State == WebSocketState.Open)
            {
                var input = await socket.ReadInputAsync(buffer);
                _world.InputQueue.Post(new PlayerInput(playerConnection.PlayerId, input));
            }
        }
    }
}
