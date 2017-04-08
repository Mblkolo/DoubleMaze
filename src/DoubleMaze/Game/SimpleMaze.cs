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

    public class SimpleMaze
    {
        private readonly Func<GameState, Task> callback;
        private readonly Timer timer;

        public SimpleMaze(Func<GameState, Task> callback)
        {
            this.callback = callback;
            timer = new Timer(Update, new object(), 0, 100);
        }

        Random r = new Random();
        public void Update(object o)
        {
            

            callback(new GameState
            {
                pos = new Pos { x = (float)(200 * r.NextDouble()), y = (float)(200 * r.NextDouble()) }
            });
        }


        public void Execute()
        {

        }
    }
}
