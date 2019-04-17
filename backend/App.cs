using System;
using System.Threading.Tasks;

namespace nekzor.github.io.lp
{
    internal class App
    {
        public static readonly string Version = "nekzor.github.io.lp/1.0";
        public static readonly string CurDir = $"{System.IO.Path.GetDirectoryName(typeof(App).Assembly.Location)}/";
        public static readonly string Cache = $"{CurDir}cache/";
        public static readonly string Api = $"{CurDir}../api/";
        public static readonly string ApiBoards = $"{Api}boards/";
        public static readonly string ApiPlayers = $"{Api}players/";

        private static async Task Main(string[] args)
        {
            Logger.Log($"Version: {Version}");

            try
            {
                var lp = new LeastPortals(Version);

                if (System.IO.Directory.Exists(Cache))
                    await lp.Import();
                else
                {
                    System.IO.Directory.CreateDirectory(Cache);
                    System.IO.Directory.CreateDirectory(Api);
                    System.IO.Directory.CreateDirectory(ApiBoards);
                    System.IO.Directory.CreateDirectory(ApiPlayers);

                    await lp.Initialize();
                    await lp.Filter();
                }

                await lp.CreateBoards(30);
                await lp.Export();
            }
            catch (Exception ex)
            {
                Logger.Log(ex.ToString());
            }

            Logger.WriteLogFile();
        }
    }
}
