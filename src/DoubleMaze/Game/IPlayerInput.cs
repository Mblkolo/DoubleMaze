using DoubleMaze.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoubleMaze.Game
{
    public enum InputType
    {
        KeyDown,
        PlayerName,
    }

    public interface IPlayerInput
    {
        InputType Type { get; }
    }

    public class PlayerNameInput : IPlayerInput
    {
        public InputType Type => InputType.PlayerName;

        public readonly string Name;

        public PlayerNameInput(string name)
        {
            Name = name;
        }

        public override string ToString()
        {
            return ObjectDumper.Dump(this);
        }
    }
}
