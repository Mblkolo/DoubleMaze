using System;
using System.Threading.Tasks.Dataflow;

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
            state.Players[playerId].Output.Post(new GotoCommand { area = GotoCommand.Areas.Welcome });
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if (o != null)
            {
                state.Players[playerId].Name = o.Name ?? "Вася, да?";
                state.Players[playerId].PlayerHandler = new GameAreaHandler(playerId, state);
                state.Players[playerId].PlayerHandler.PlayerJoin();
            }
        }
    }
}
