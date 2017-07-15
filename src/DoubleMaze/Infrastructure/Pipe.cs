using System;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace DoubleMaze.Infrastructure
{
    public class Pipe<T>
    {
        private readonly BufferBlock<T> queue;

        public Pipe()
        {
            queue = new BufferBlock<T>();
        }

        public async Task<bool> OutputAvailableAsync()
        {
            return await queue.OutputAvailableAsync();
        }

        public async Task<T> ReceiveAsync()
        {
            return await queue.ReceiveAsync();
        }

        public void Complete()
        {
            queue.Complete();
        }

        public void Post(T data)
        {
            queue.Post(data);
        }
    }
}
