using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public class GameAreaHandler : IPlayerHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;
        private readonly MazePlayer player;

        public GameAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
            player = new MazePlayer(state.Players[playerId].Output);

            var game = state.Games.Values.SingleOrDefault(x => x.IsStarted == false);
            if (game == null)
            {
                Guid gameId = Guid.NewGuid();
                game = new SimpleMaze(state, gameId, player);
                state.Games.Add(gameId, game);
            }
            else
                game.Join(player);
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as KeyDownInput;
            if (o != null)
                player.command = o.Command;
        }
    }
}
