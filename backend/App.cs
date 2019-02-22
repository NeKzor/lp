using System;
using System.Threading.Tasks;

namespace nekzor.github.io.lp
{
    internal class App
    {
        public static readonly string Version = "nekzor.github.io.lp/1.0";
        public static readonly string CurDir = $"{System.IO.Path.GetDirectoryName(typeof(App).Assembly.Location)}/";
        public static readonly string Cache = $"{CurDir}cache/";
        public static readonly string Boards = $"{CurDir}boards/";
        public static readonly string Players = $"{CurDir}players/";

        private static async Task Main(string[] args)
        {
            Logger.Log($"Version: {Version}");
            var lp = new LeastPortals(Version);

            if (System.IO.Directory.Exists(Cache))
                await lp.Import();
            else
            {
                System.IO.Directory.CreateDirectory(Cache);
                System.IO.Directory.CreateDirectory(Boards);
                System.IO.Directory.CreateDirectory(Players);

                await lp.Initialize();
                await lp.Filter();
            }

            await lp.CreateBoards();
            await lp.Export();

            Logger.WriteLogFile();
        }
    }
}
