using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SteamCommunity;

namespace nekzor.github.io.lp
{
    internal static class Logger
    {
        private static readonly string _logFile = "log.txt"; 
        private static List<string> _logs = new List<string>();

        public static void Log(string message)
        {
            var log = $"[{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")}] [leastportals] {message}";
            _logs.Add(log);
            Console.WriteLine(log);
        }
        public static Task LogSteamCommunityClient(object _, SteamCommunity.LogMessage message)
        {
            Log(message.ToString());
            return Task.CompletedTask;
        }
        public static async void WriteLogFile()
        {
            await System.IO.File.AppendAllLinesAsync(App.CurDir + _logFile, _logs);
        }
    }
}
