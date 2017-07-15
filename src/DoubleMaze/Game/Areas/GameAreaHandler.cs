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
                    state.Players[playerId].SetHandler(new WaitGameHandler(playerId, state));
                }
                return;
            }

            var o = inputCommand as KeyDownInput;
            if (o != null)
                mazePlayer.Сommand = o.Command;
        }

        public void PlayerJoin()
        {
            mazePlayer.Output.Post(new GotoCommand { area = GotoCommand.Areas.Game });
            game.SendState(mazePlayer);
        }

        public void PlayerLeft()
        {
            mazePlayer.IsLeft = true;

            if (game.AllPlayersLeft())
            {
                game.FinishGame();
                state.Games.Remove(game.GameId);
            }
        }
    }
}
