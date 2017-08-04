using System;

namespace DoubleMaze.Game.Areas
{
    public class GameAreaHandler : IAreaHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;

        private readonly MazePlayer mazePlayer;
        private readonly SimpleMaze game;

        public GameAreaHandler(Guid playerId, WorldState state, SimpleMaze game, MazePlayer mazePlayer)
        {
            this.playerId = playerId;
            this.state = state;
            this.game = game;

            this.mazePlayer = mazePlayer;;
        }

        public void Process(IPlayerInput inputCommand)
        {
            var playAgain = inputCommand as PlayAgainInput;
            if(playAgain != null)
            {
                if(game.IsFinished)
                {
                    var handler = state.Players[playerId].PlayerType == PlayerType.Bot
                            ? (IAreaHandler)new StasisAreaHandler(playerId, state)
                            : new WaitGameHandler(playerId, state);

                    state.Players[playerId].SetHandler(handler);
                }
                return;
            }

            var o = inputCommand as KeyDownInput;
            if (o != null)
                mazePlayer.Сommand = o.Command;
        }

        public void PlayerJoin()
        {
            if(state.Players[playerId].PlayerType == PlayerType.Bot)
                state.BotInGame.Add(playerId);

            mazePlayer.Output.Post(new GotoCommand { area = GotoCommand.Areas.Game });
            game.SendState(mazePlayer);
        }

        public void PlayerLeft()
        {
            if (state.Players[playerId].PlayerType == PlayerType.Bot)
                state.BotInGame.Remove(playerId);

            mazePlayer.IsLeft = true;

            if (game.AllPlayersLeft())
            {
                game.FinishGame();
                state.Games.Remove(game.GameId);
            }
        }
    }
}
