﻿using DoubleMaze.Game.Maze;
using DoubleMaze.Infrastructure;
using System;
using System.Linq;
using System.Threading;

namespace DoubleMaze.Game
{
    public class Pos {
        public float x;
        public float y;
    }

    public class SimpleMaze
    {
        private MazeGenerator mazeGenerator = new MazeGenerator();

        private Timer timer;
        private MazePlayer firstPlayer;
        private MazePlayer secondPlayer;
        private WorldState state;
        public Guid GameId;
        private MazeField mazeField;

        public SimpleMaze(WorldState state, MazePlayer firstPlayer, MazePlayer secondPlayer)
        {
            mazeField = mazeGenerator.Generate(31, 21);
            this.state = state;
            GameId = Guid.NewGuid();
            this.firstPlayer = firstPlayer;
            this.secondPlayer = secondPlayer;

            secondPlayer.SetStart(mazeField.Field.GetLength(1) - 1, mazeField.Field.GetLength(0) - 1);
            timer = new Timer(x => state.InputQueue.Post(new GameUpdate(GameId)), new object(), 100, 100);
        }

        public bool IsFinished { get; private set; } = false;

        public void Update()
        {
            if (IsFinished)
                return;

            firstPlayer.Update(mazeField.Field);
            secondPlayer.Update(mazeField.Field);

            if (mazeField.WinZone.Contains(firstPlayer.GetCurrentCeil()) || mazeField.WinZone.Contains(secondPlayer.GetCurrentCeil()))
            {
                firstPlayer.IsWin = mazeField.WinZone.Contains(firstPlayer.GetCurrentCeil());
                secondPlayer.IsWin = mazeField.WinZone.Contains(secondPlayer.GetCurrentCeil());

                FinishGame();

                Rating.Update(firstPlayer.Rating, secondPlayer.Rating, firstPlayer.IsWin, secondPlayer.IsWin);

                state.Storage.SavePlayer(state.Players[firstPlayer.Id].GetStoreData());
                state.Storage.SavePlayer(state.Players[secondPlayer.Id].GetStoreData());

                SendState(firstPlayer);
                SendState(secondPlayer);
                return;
            }

            SendPosition(firstPlayer, secondPlayer);
            SendPosition(secondPlayer, firstPlayer);
        }

        internal bool AllPlayersLeft()
        {
            return firstPlayer.IsLeft && secondPlayer?.IsLeft != false;
        }

        private static void SendPosition(MazePlayer player, MazePlayer enemyPlayer)
        {
            if (player.IsLeft)
                return;

            player.Output.Post(new PlayerPosCommand
            {
                myPos = player.GetPos(),
                enemyPos = enemyPlayer.GetPos()
            });
        }

        public void SendState(MazePlayer player)
        {
            if(player.IsLeft)
                return;

            if (IsFinished == false)
            {
                var enemy = GetEnemy(player);
                var command = new MazeFieldCommand
                {
                    field = mazeField.Field,
                    me = new MazeFieldCommandPlayer
                    {
                        name = player.Name,
                        rating = player.Rating.RoundValue
                    },
                    enemy = new MazeFieldCommandPlayer
                    {
                        name = enemy.Name,
                        rating = enemy.Rating.RoundValue
                    }
                };

                player.Output.Post(command);
            }
            else
            {
                var enemy = GetEnemy(player);

                player.Output.Post(new GameOverCommand
                {
                    status = player.IsWin
                        ? GameOverCommand.Statuses.Win
                        : GameOverCommand.Statuses.Lose,

                    ratings = state.Players.Select(x => new GameOverCommandRating
                    {
                        name = x.Value.Name,
                        rating = x.Value.Rating.RoundValue,
                        isMe = x.Key == player.Id,
                        isEnemy = x.Key == enemy.Id
                    })
                    .OrderByDescending(x => x.rating)
                    .ThenBy(x => x.name)
                    .ToArray()
            });
            }
        }

        private MazePlayer GetEnemy(MazePlayer player)
        {
            if (player == firstPlayer)
                return secondPlayer;

            if (player == secondPlayer)
                return firstPlayer;

            throw new Exception("Это не наш игрок!");
        }

        public void FinishGame()
        {
            IsFinished = true;
            timer?.Dispose();
        }
    }

    public struct RectZone
    {
        public readonly int Left;
        public readonly int Top;
        public readonly int Width;
        public readonly int Height;

        public RectZone(int left, int top, int width, int height)
        {
            Left = left;
            Top = top;
            Width = width;
            Height = height;
        }

        public bool Contains(Point pos)
        {
            return Left <= pos.X && pos.X < Left + Width && 
                    Top <= pos.Y && pos.Y < Top + Height;
        }

        public override string ToString()
        {
            return $"Left:{Left}, Top:{Top}, Width:{Width}, Height:{Height}";
        }
    }

    public struct Point
    {
        public readonly int X;
        public readonly int Y;

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public Point Move(int dx, int dy)
        {
            return new Point(X + dx, Y + dy);
        }

        public static bool operator !=(Point obj1, Point obj2)
        {
            return !(obj1 == obj2);
        }

        public static bool operator ==(Point obj1, Point obj2)
        {
            return obj1.X == obj2.X && obj1.Y == obj2.Y;
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return $"X:{X}, Y:{Y}";
        }
    }

    public class MazePlayer
    {
        public InputCommand Сommand;
        public Pipe<IGameCommand> Output => playerContex.Output;
        public string Name => playerContex.Name;
        public Rating Rating =>  playerContex.Rating;
        public Guid Id => playerContex.Id;
        public bool IsLeft { get; internal set; }
        public bool IsWin { get; internal set; }

        private Point pos = new Point();
        private Point nextpos = new Point();
        private float progress = 0;
        private InputCommand currentCommand;
        private PlayerContex playerContex;

        public MazePlayer(PlayerContex playerContex)
        {
            this.playerContex = playerContex;
        }

        public Pos GetPos() => new Pos { x = pos.X * (1 - progress) + nextpos.X * progress, y = pos.Y * (1 - progress) + nextpos.Y * progress };

        public Point GetCurrentCeil() => new Point(pos.X, pos.Y);

        public void SetStart(int x, int y)
        {
            pos = nextpos = new Point(x, y);
            progress = 0;
        }

        public void Update(Wall[,] mazeField)
        {
            const float progressInTick = 0.3f;

            progress += progressInTick;
            if (progress > 1 || currentCommand == InputCommand.None)
            {
                pos = nextpos;
                if (Сommand == InputCommand.Down && (mazeField[pos.Y, pos.X] & Wall.Bottom) == 0)
                    nextpos = pos.Move(0, 1);

                if (Сommand == InputCommand.Up && (mazeField[pos.Y, pos.X] & Wall.Top) == 0)
                    nextpos = pos.Move(0, -1);

                if (Сommand == InputCommand.Left && (mazeField[pos.Y, pos.X] & Wall.Left) == 0)
                    nextpos = pos.Move(-1, 0);

                if (Сommand == InputCommand.Right && (mazeField[pos.Y, pos.X] & Wall.Right) == 0)
                    nextpos = pos.Move(1, 0);

                if (nextpos.Y != pos.Y || nextpos.X != pos.X)
                {
                    if (progress > 1)
                        progress -= 1;
                    currentCommand = Сommand;
                }
                else
                {
                    progress = 0;
                    currentCommand = InputCommand.None;
                }
            }
        }
    }
}
