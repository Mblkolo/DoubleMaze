using System;
using Microsoft.Extensions.Logging;

namespace DoubleMaze.Infrastructure.Logging
{
    public class JsonConsoleLogger : ILogger
    {
        private readonly string name;

        public JsonConsoleLogger(string name)
        {
            this.name = name;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }
            var message = string.Empty;
            if (formatter != null)
            {
                message = formatter(state, exception);
            }
            else
            {
                if (state != null)
                {
                    message += state;
                }
                if (exception != null)
                {
                    message += Environment.NewLine + exception;
                }
            }
            if (!string.IsNullOrEmpty(message))
            {
                Console.WriteLine($@"{{""name"": ""{name}"", ""level"": ""{logLevel}"", ""eventId"": ""{eventId.Id}"", ""message"": ""{message}""}}");
            }
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return new JsonConsoleLoggerScope();
        }
    }

    class JsonConsoleLoggerScope : IDisposable
    {
        public void Dispose()
        {
        }
    }
}
