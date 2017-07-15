using System;

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
                state.Players[playerId].Output.Post(new GotoCommand { area = GotoCommand.Areas.Wait });
            }
            else
            {
                var secondPlayer = new MazePlayer(state.Players[playerId]);
                var firstPlayer = new MazePlayer(state.Players[state.WaitPlayer.Value]);

                var game = new SimpleMaze(state, Guid.NewGuid(), firstPlayer, secondPlayer);
                state.Games.Add(game.GameId, game);

                state.Players[firstPlayer.Id].SetHandler(new GameAreaHandler(firstPlayer.Id, state, game, firstPlayer));
                state.Players[secondPlayer.Id].SetHandler(new GameAreaHandler(secondPlayer.Id, state, game, secondPlayer));
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
        }
    }
}
