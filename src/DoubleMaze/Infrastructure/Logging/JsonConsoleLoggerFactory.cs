using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure.Logging
{
    public class JsonConsoleLoggerFactory : ILoggerProvider
    {
        public void Dispose()
        {
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new JsonConsoleLogger(categoryName);
        }
    }
}