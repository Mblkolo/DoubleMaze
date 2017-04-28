using System;

namespace DoubleMaze.Game
{
    public class WelcomeAreaHandler : IPlayerHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;

        public WelcomeAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
        }

        public void PlayerJoin()
        {
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if (o != null)
            {
                state.Players[playerId].Name = o.Name;
                state.Players[playerId].PlayerHandler = new GameAreaHandler(playerId, state);
            }
        }
    }
}
