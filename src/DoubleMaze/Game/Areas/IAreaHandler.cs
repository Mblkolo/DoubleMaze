namespace DoubleMaze.Game.Areas
{
    public interface IAreaHandler
    {
        void Process(IPlayerInput inputCommand);
        void PlayerJoin();
        void PlayerLeft();
    }
}
