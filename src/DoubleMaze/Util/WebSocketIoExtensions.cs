using DoubleMaze.Game;
using Newtonsoft.Json;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DoubleMaze.Util
{
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

            if (result.MessageType == WebSocketMessageType.Close)
                return null;

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

            if (checker.Type == InputType.PlayWithBot)
                return JsonConvert.DeserializeObject<PlayWithBotInput>(message);

            throw new NotImplementedException();
        }

        private class CheckType : IPlayerInput
        {
            public InputType Type { get; set; }
        }
    }
}
