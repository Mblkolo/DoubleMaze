using System;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game.Areas
{
    public class WelcomeAreaHandler : IAreaHandler
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
            var context = state.Players[playerId];
            var output = context.Output;

            output.Post(new GotoCommand { area = GotoCommand.Areas.Welcome });
            output.Post(new WelcomePlayerInfo
            {
                Name = context.Name,
                Rating = context.Rating.Value
            });
        }

        public void PlayerLeft()
        {
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if (o != null)
            {
                state.Players[playerId].Name = string.IsNullOrWhiteSpace(o.Name) ? NameGenerator.GenerateName() : o.Name.Trim();
                state.Players[playerId].SetHandler(new GameAreaHandler(playerId, state));
            }
        }


    }
}
