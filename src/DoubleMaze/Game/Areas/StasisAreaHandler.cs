using System;

namespace DoubleMaze.Game.Areas
{
    public class StasisAreaHandler : IAreaHandler
    {
        private Guid playerId;
        private WorldState state;

        public StasisAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
        }

        public void PlayerJoin()
        {
            state.Players[playerId].Output.Post(new GotoCommand { area = GotoCommand.Areas.Stasis });
        }

        public void PlayerLeft()
        {
            
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if(o != null)
            {
                state.Players[playerId].Name = o.Name;
            }
        }
    }
}
