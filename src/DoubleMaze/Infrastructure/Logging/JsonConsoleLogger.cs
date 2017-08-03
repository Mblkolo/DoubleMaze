using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
                JsonConvert.SerializeObject(new LogMessageDto
                {
                    LogLevel = logLevel,
                    Name = name,
                    EventId = eventId.Name ?? eventId.Id.ToString(),
                    Message = message
                });
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

        private class JsonConsoleLoggerScope : IDisposable
        {
            public void Dispose()
            {
            }
        }

        private class LogMessageDto
        {
            public string Name { get; set; }
            public LogLevel LogLevel { get; set; }
            public string EventId { get; set; }
            public string Message { get; set; }
        }
    }
}
