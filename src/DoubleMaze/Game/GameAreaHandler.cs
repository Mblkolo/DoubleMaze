using System;
using System.Linq;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public class GameAreaHandler : IPlayerHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;

        private readonly MazePlayer mazePlayer;
        private readonly SimpleMaze game;

        public GameAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
            mazePlayer = new MazePlayer(state.Players[playerId].Output, state.Players[playerId].Name);

            game = state.Games.Values.SingleOrDefault(x => x.IsStarted == false);
            if (game == null)
            {
                Guid gameId = Guid.NewGuid();
                game = new SimpleMaze(state, gameId, mazePlayer);
                state.Games.Add(gameId, game);
            }
            else
                game.Join(mazePlayer);
        }

        public void Process(IPlayerInput inputCommand)
        {
            var playAgain = inputCommand as PlayAgainInput;
            if(playAgain != null)
            {
                if(game.IsFinished)
                {
                    state.Players[playerId].SetHandler(new GameAreaHandler(playerId, state));
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
                state.Games.Remove(game.gameId);
            }
        }
    }
}
