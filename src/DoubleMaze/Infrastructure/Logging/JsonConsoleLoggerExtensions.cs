using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure.Logging
{
    public static class JsonConsoleLoggerExtensions
    {
        public static ILoggerFactory AddJsonConsole(this ILoggerFactory factory)
        {
            factory.AddProvider(new JsonConsoleLoggerFactory());
            return factory;
        }
    }
}
