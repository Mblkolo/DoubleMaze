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
                state.Players[state.WaitPlayer.Value].SetHandler(new GameAreaHandler(state.WaitPlayer.Value, state));
                state.Players[playerId].SetHandler(new GameAreaHandler(playerId, state));
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
