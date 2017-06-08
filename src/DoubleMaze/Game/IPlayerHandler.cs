namespace DoubleMaze.Game
{
    public interface IPlayerHandler
    {
        void Process(IPlayerInput inputCommand);
        void PlayerJoin();
        void PlayerLeft();
    }
}
