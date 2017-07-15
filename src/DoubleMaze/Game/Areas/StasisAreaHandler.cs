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
            throw new NotImplementedException();
        }

        public void PlayerLeft()
        {
            throw new NotImplementedException();
        }

        public void Process(IPlayerInput inputCommand)
        {
            throw new NotImplementedException();
        }
    }
}
