using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public class GameState
    {
        public Pos pos { get; set; }
    }

    public class Pos {
        public float x;
        public float y;
    }

    public enum InputCommand
    {
        None,
        BeganUp,
        EndUp
    }

    public class SimpleMaze
    {
        private readonly Func<GameState, Task> callback;
        private readonly Timer timer;

        public SimpleMaze(Func<GameState, Task> callback)
        {
            this.callback = callback;
            timer = new Timer(Update, new object(), 0, 100);
        }

        private volatile InputCommand latestCommand;

        private Pos PlayerPos = new Pos();
        Random r = new Random();
        public void Update(object o)
        {
            var command = latestCommand;
            if (command == InputCommand.BeganUp)
            {
                PlayerPos.y += 10;
            }

            callback(new GameState
            {
                pos = new Pos { x = PlayerPos.x, y = PlayerPos.y }
            });
        }


        public void Execute(InputCommand command)
        {
            latestCommand = command;
        }
    }
}
