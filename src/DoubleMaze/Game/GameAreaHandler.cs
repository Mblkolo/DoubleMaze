﻿using System;
using System.Linq;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Game
{
    public class GameAreaHandler : IPlayerHandler
    {
        private readonly Guid playerId;
        private readonly WorldState state;
        private readonly MazePlayer player;
        private readonly SimpleMaze game;

        public GameAreaHandler(Guid playerId, WorldState state)
        {
            this.playerId = playerId;
            this.state = state;
            player = new MazePlayer(state.Players[playerId].Output);

            game = state.Games.Values.SingleOrDefault(x => x.IsStarted == false);
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
            var playAgain = inputCommand as PlayAgainInput;
            if(playAgain != null)
            {
                if(game.IsFinished)
                {
                    state.Players[playerId].PlayerHandler = new GameAreaHandler(playerId, state);
                    state.Players[playerId].PlayerHandler.PlayerJoin();
                }
                return;
            }


            var o = inputCommand as KeyDownInput;
            if (o != null)
                player.Сommand = o.Command;
        }

        public void PlayerJoin()
        {
            player.Output.Post(new GotoCommand { area = GotoCommand.Areas.Game });
            game.SendState(player);
        }
    }
}