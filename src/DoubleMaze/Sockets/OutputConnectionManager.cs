using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace DoubleMaze.Sockets
{
    public class PlayerConnection
    {
        public Guid ConnectionId { get; }
        public OutputChanel OutputChanel { get; }
        public Guid PlayerId { get; }

        public PlayerConnection(Guid playerId, OutputChanel outputChanel)
        {
            ConnectionId = Guid.NewGuid();
            OutputChanel = outputChanel;
            PlayerId = playerId;
        }
    }

    public class OutputConnectionManager
    {
        private object Locker = new object();
        private List<PlayerConnection> PlayerConnections = new List<PlayerConnection>();
        private Dictionary<Guid, Timer> TimeoutTimers = new Dictionary<Guid, Timer>();

        private Action<Guid> playerDisconnected;

        public OutputConnectionManager(Action<Guid> playerDisconnected)
        {
            this.playerDisconnected = playerDisconnected;
        }

        internal PlayerConnection PlayerConnected(Guid playerId, OutputChanel outputChanel)
        {
            lock (Locker)
            {
                 foreach (var connection in PlayerConnections.Where(x => x.PlayerId == playerId).ToArray())
                    RemoveConnection(connection);

                var newConnection = new PlayerConnection(playerId, outputChanel);
                PlayerConnections.Add(newConnection);

                DisploseAndRemoveTimer(playerId);

                return newConnection;
            }
        }

        private void RemoveConnection(PlayerConnection connection)
        {
            connection.OutputChanel.Pipe.Complete();
            PlayerConnections.Remove(connection);
        }

        internal void ConnectionClosed(Guid connectionId)
        {
            lock (Locker)
            {
                var connection = PlayerConnections.Where(x => x.ConnectionId == connectionId).SingleOrDefault();
                if (connection == null)
                    return;

                RemoveConnection(connection);

                var timer = new Timer(TimeoutPlayer, connection.PlayerId, TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
                TimeoutTimers.Add(connection.PlayerId, timer);
            }
        }

        private void TimeoutPlayer(object playerIdObject)
        {
            Guid playerId = (Guid)playerIdObject;
            lock (Locker)
            {
                if (TimeoutTimers.ContainsKey(playerId) == false)
                    return;

                DisploseAndRemoveTimer(playerId);
                playerDisconnected(playerId);
            }
        }

        private void DisploseAndRemoveTimer(Guid playerId)
        {
            if (TimeoutTimers.ContainsKey(playerId))
            {
                TimeoutTimers[playerId].Dispose();
                TimeoutTimers.Remove(playerId);
            }
        }

    }

}
