using DoubleMaze.Infrastructure;
using System;
using System.Threading.Tasks;

namespace DoubleMaze.Game.Bots
{
    public class Bot
    {
        public readonly Pipe<IGameCommand> Input = new Pipe<IGameCommand>();
        public readonly string Name;
        public readonly Guid BotId = Guid.NewGuid();

        private readonly Pipe<IMessage> Output;
        private readonly Task ProcessTask;

        public Bot(Pipe<IMessage> output, string name)
        {
            Output = output;
            ProcessTask = Process();
            Name = name;
        }

        private async Task Process()
        {
            Output.Post(new PlayerConnected(BotId, Input));

            while(await Input.OutputAvailableAsync())
            {
                IGameCommand command = await Input.ReceiveAsync();

                Process((dynamic)command);
            }
        }

        private void Process(IGameCommand command)
        {
            //Неизвестная комманда
        }

        private GotoCommand.Areas currentArea;

        private void Process(GotoCommand command)
        {
            currentArea = command.area;
            if (currentArea == GotoCommand.Areas.Welcome)
                Output.Post(new PlayerInput(BotId, new PlayerNameInput(Name)));

            //if(currentArea == GotoCommand.Areas.Game)
        }

        private void Process(GameOverCommand command)
        {
            Output.Post(new PlayerInput(BotId, new PlayAgainInput()));
        }

        private Pos latestPos = null;
        private Random r = new Random();
        private InputCommand[] directions = new[] { InputCommand.Up, InputCommand.Right, InputCommand.Left, InputCommand.Down };


        private void Process(PlayerPosCommand command)
        {
            if (latestPos != null && latestPos.x == command.myPos.x && latestPos.y == command.myPos.y)
            {
                var randomDirection = directions[r.Next(directions.Length)];
                Output.Post(new PlayerInput(BotId, new KeyDownInput(randomDirection)));
            }

            latestPos = command.myPos;
        }
    }
}
