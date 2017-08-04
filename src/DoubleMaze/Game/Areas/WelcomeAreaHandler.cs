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
            var output = state.Players[playerId].Output;

            output.Post(new GotoCommand { area = GotoCommand.Areas.Welcome });
        }

        public void PlayerLeft()
        {
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if (o != null)
            {
                var player = state.Players[playerId];
                player.Name = string.IsNullOrWhiteSpace(o.Name) ? NameGenerator.GenerateName() : o.Name.Trim();

                if(player.IsActivated == false)
                {
                    player.IsActivated = true;
                    state.Storage.SavePlayer(player.GetStoreData());
                }

                player.SetHandler(new WaitGameHandler(playerId, state));
            }
        }


    }
}
