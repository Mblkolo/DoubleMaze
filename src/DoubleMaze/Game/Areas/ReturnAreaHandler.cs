﻿using System;

namespace DoubleMaze.Game.Areas 
{
    public class ReturnAreaHandler : IAreaHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;

        public ReturnAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
        }

        public void PlayerJoin()
        {
            var context = state.Players[playerId];

            context.Output.Post(new GotoCommand { area = GotoCommand.Areas.Return });
            context.Output.Post(new PlayerInfo
            {
                name = context.Name,
                rating = context.Rating.RoundValue
            });
        }

        public void PlayerLeft()
        {
        }

        public void Process(IPlayerInput inputCommand)
        {
            if(inputCommand is PlayAgainInput)
            {
                state.Players[playerId].SetHandler(new WaitGameHandler(playerId, state));
                return;
            }

            if(inputCommand is ResetPlayerInput)
            {
                var context = state.Players[playerId];
                context.ResetPlayer();
                state.Players[playerId].SetHandler(new WelcomeAreaHandler(playerId, state));
                return;
            }
        }
    }
}
