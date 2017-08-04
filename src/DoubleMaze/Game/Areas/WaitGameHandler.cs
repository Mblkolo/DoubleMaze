using System;
using System.Linq;

namespace DoubleMaze.Game.Areas
{
    public class WaitGameHandler : IAreaHandler
    {
        private Guid playerId;
        private WorldState state;

        public WaitGameHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
        }

        public void PlayerJoin()
        {
            if (state.WaitPlayer == null || state.WaitPlayer == playerId)
            {
                state.WaitPlayer = playerId;

                var outPipe = state.Players[playerId].Output;

                outPipe.Post(new GotoCommand { area = GotoCommand.Areas.Wait });
                outPipe.Post(new ShowBotsCommand
                {
                    bots = state.Players.Values
                        .Where(x => x.PlayerType == PlayerType.Bot)
                        .Select((x, i) => new ShowBotsBot
                        {
                            id = x.Id.ToString("N"),
                            isAwaible = state.BotInGame.Contains(x.Id) == false,
                            name = x.Name,
                            rating = x.Rating.RoundValue
                        }
                      )
                      .OrderBy(x => x.rating)
                      .ThenBy(x => x.name.Length)
                      .ThenBy(x => x.name)
                      .ToArray()
                });
            }
            else
            {
                StartGame(state.WaitPlayer.Value, playerId);
            }
        }

        public void PlayerLeft()
        {
            if (state.WaitPlayer == playerId)
                state.WaitPlayer = null;
        }

        public void Process(IPlayerInput inputCommand)
        {
            //Тут можно сыграть с ботом
            var c = inputCommand as PlayWithBotInput;
            if(c != null)
            {
                Guid botId;
                if (Guid.TryParse(c.BotId, out botId) == false)
                    return;

                PlayerContex bot;
                if (state.Players.TryGetValue(botId, out bot) == false || bot.PlayerType != PlayerType.Bot)
                    return;

                StartGame(playerId, bot.Id);
                return;
            }
        }

        private void StartGame(Guid firstPlayerId, Guid secondPlayerId)
        {
            var firstPlayer = new MazePlayer(state.Players[firstPlayerId]);
            var secondPlayer = new MazePlayer(state.Players[secondPlayerId]);

            var game = new SimpleMaze(state, firstPlayer, secondPlayer);
            state.Games.Add(game.GameId, game);

            state.Players[firstPlayer.Id].SetHandler(new GameAreaHandler(firstPlayer.Id, state, game, firstPlayer));
            state.Players[secondPlayer.Id].SetHandler(new GameAreaHandler(secondPlayer.Id, state, game, secondPlayer));
        }
    }
}
