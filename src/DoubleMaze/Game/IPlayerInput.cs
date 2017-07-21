using System;
using DoubleMaze.Util;

namespace DoubleMaze.Game
{
    public enum InputType
    {
        KeyDown,
        PlayerName,
        Token,
        PlayAgain,
        ResetPlayer,
        PlayWithBot,
    }

    public interface IPlayerInput
    {
        InputType Type { get; }
    }

    public enum InputCommand
    {
        None,
        Up,
        Left,
        Right,
        Down
    }

    public class KeyDownInput : IPlayerInput
    {
        public InputType Type => InputType.KeyDown;

        public readonly InputCommand Command;

        public KeyDownInput(InputCommand command)
        {
            Command = command;
        }

        public override string ToString()
        {
            return ObjectDumper.Dump(this);
        }
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

    public class TokenInput : IPlayerInput
    {
        public InputType Type => InputType.Token;

        public string Token { get; set; }

        public override string ToString()
        {
            return ObjectDumper.Dump(this);
        }
    }

    class PlayAgainInput : IPlayerInput
    {
        public InputType Type => InputType.PlayAgain;
    }

    class ResetPlayerInput : IPlayerInput
    {
        public InputType Type => InputType.ResetPlayer;
    }

    public class PlayWithBotInput : IPlayerInput
    {
        public InputType Type => InputType.PlayWithBot;

        public string BotId { get; set; }
    }
}
