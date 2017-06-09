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

        public void PlayerLeft()
        {
        }

        public void Process(IPlayerInput inputCommand)
        {
            var o = inputCommand as PlayerNameInput;
            if (o != null)
            {
                state.Players[playerId].Name = o.Name ?? GenerateName(new Random());
                state.Players[playerId].SetHandler(new GameAreaHandler(playerId, state));
            }
        }

        private static string[] FirstPart =
        {
            "Быстрый",
            "Неспешный",
            "Ленивый",
            "Энергичный",
            "Толстый",
            "Худой",
            "Задумчивый",
            "Резвый",
            "Суровый",
            "Хромой",
            "Сонный",
            "Весёлый",
            "Грустный",
            "Жизнерадостный",
            "Забавный",
            "Остроумный",
            "Находчивый",
            "Торопливый",
            "Квёлый",
            "Борзый",
            "Милый",
            "Расчётливый",
            "Приветливый",
            "Улыбчивый",
            "Задорный",
            "Стройный",
        };

        private static string[] SecondPart =
        {
            "ленивец",
            "попугай",
            "слон",
            "носорог",
            "жираф",
            "заяц",
            "медведь",
            "волк",
            "пёс",
            "суслик",
            "сурок",
            "кот",
            "петух",
            "енот",
            "бык",
            "опоссум",
            "орёл",
            "воробей",
            "голубь",
            "скат",
            "карась",
            "кит",
            "дельфин",
            "зяблик",
            "тюлень",
            "дятел",
            "муравей",
            "комар",
            "шмель",
            "шершень",
            "верблюд",
            "утконос",
            "окунь",
            "воран",
            "павлин",
            "фламинго",
            "броненосец",
            "пингвин",
        };

        public static string GenerateName(Random r)
        {
            return FirstPart[r.Next(FirstPart.Length)] + " " + SecondPart[r.Next(SecondPart.Length)];
        }
    }
}
