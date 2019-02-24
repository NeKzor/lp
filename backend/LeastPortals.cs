using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Portal2Boards.Extensions;
using SteamCommunity;

namespace nekzor.github.io.lp
{
    internal class LeastPortals
    {
        private List<Map> _wrs;
        private List<Player> _players;
        private List<Player> _players2;
        private List<ScoreboardEntry> _scoreboard;
        private Statistics _stats;

        private readonly SteamCommunityClient _client;

        public LeastPortals(string userAgent)
        {
            _players = new List<Player>();
            _players2 = new List<Player>();
            _scoreboard = new List<ScoreboardEntry>();
            _stats = new Statistics();
            _ = _stats.Import($"{App.CurDir}stats.json");

            _client = new SteamCommunityClient(userAgent, false);
            _client.Log += Logger.LogSteamCommunityClient;

            _wrs = JsonConvert.DeserializeObject<List<Map>>(File.ReadAllText($"{App.CurDir}wrs.json"));

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                Converters = { new UlongConverter() }
            };
        }

        public async Task Initialize()
        {
            var game = await _client.GetLeaderboardsAsync("Portal 2");
            Logger.Log("Fetched Portal 2 leaderboard");

            var excluded = _wrs
                .Where(x => x.Excluded)
                .Select(x => x.Id);
            var sp = game.Entries
                .Where(lb => lb.Name.StartsWith("challenge_portals_sp"))
                .Where(lb => !excluded.Contains((ulong)lb.Id));
            var mp = game.Entries
                .Where(lb => lb.Name.StartsWith("challenge_portals_mp"))
                .Where(lb => !excluded.Contains((ulong)lb.Id));

            var official = Portal2.CampaignMaps
                .Where(x => x.IsOfficial)
                .Where(x => !excluded.Contains((ulong)x.BestPortalsId));

            // Local function
            async Task Cache(List<Player> players, IEnumerable<IStatsLeaderboardEntry> leaderboards, IEnumerable<Portal2Map> campaign)
            {
                var maps = new Dictionary<(int id, string displayName), List<CacheItem>>();
                foreach (var lb in leaderboards)
                {
                    var entries = new List<CacheItem>();
                    var wr = _wrs.First(x => x.Id == (ulong)lb.Id).WorldRecord;

                    var cache = $"{App.Cache}{lb.Id}.json";
                    var logmsg = string.Empty;
                    if (!File.Exists(cache)
                        || (entries = JsonConvert.DeserializeObject<List<CacheItem>>(await File.ReadAllTextAsync(cache))) == null)
                    {
                        var page = await _client.GetLeaderboardAsync("Portal 2", lb.Id);
                        foreach (var entry in page.Entries)
                            entries.Add(new CacheItem() { Id = entry.Id, Score = entry.Score });
                        await File.WriteAllTextAsync(cache, JsonConvert.SerializeObject(entries, Formatting.Indented));
                        await Task.Delay(1000);
                        logmsg = "[DOWNLOADED] ";
                    }
                    else
                    {
                        entries = JsonConvert.DeserializeObject<List<CacheItem>>(await File.ReadAllTextAsync(cache));
                        logmsg = "[FROM CACHE] ";
                    }

                    // Check if we need a second page
                    if (entries.Last().Score == wr)
                        logmsg += " [LIMITED] ";

                    Logger.Log(logmsg + lb.Id);

                    foreach (var cheater in entries.Where(entry => entry.Score < wr))
                    {
                        Logger.Log($"[BANNED] [{cheater.Id}] {cheater.Score}");
                        _stats.AddCheater(cheater.Id);
                    }

                    maps.Add((lb.Id, lb.DisplayName), entries);
                }

                var current = 1;
                foreach (var map in maps)
                {
                    var wr = _wrs.First(x => x.Id == (ulong)map.Key.id).WorldRecord;

                    var ties = 0;
                    foreach (var entry in map.Value.Where(entry => entry.Score >= wr))
                    {
                        if (_stats.IsCheater(entry.Id))
                            continue;

                        if (entry.Score == wr)
                            ++ties;

                        var player = players.FirstOrDefault(p => p.Id == entry.Id);
                        if (player == null)
                            players.Add(player = new Player(entry.Id, campaign));

                        player.Update(map.Key.id, entry.Score);
                    }

                    _stats.SetRecordCount((ulong)map.Key.id, ties);

                    Logger.Log($"[{map.Key.id}] {map.Key.displayName} -> {ties} ({current}/{maps.Count})");
                    ++current;
                }
            }

            await Cache(_players, sp, official.Where(x => x.Type == Portal2MapType.SinglePlayer));
            await Cache(_players2, mp, official.Where(x => x.Type == Portal2MapType.Cooperative));

            Logger.Log($"Merging {_players.Count} sp and {_players2.Count} mp players");
            foreach (var player in _players)
            {
                var player2 = _players2.FirstOrDefault(p => p.Id == player.Id);
                if (player2 != null) {
                    player.Merge(player2);
                    _players2.Remove(player2);
                }
            }
            var players2 = new List<Player>();
            foreach (var player in _players2)
            {
                var player2 = _players.FirstOrDefault(p => p.Id == player.Id);
                if (player2 == null)
                    players2.Add(player);
            }
            _players.AddRange(players2);
            Logger.Log($"Merged {_players.Count} players");
        }
        public Task Filter()
        {
            Logger.Log("Filtering...");
            foreach (var player in _players)
                player.CalculateTotalScore();

            var before = _players.Count;
            _players.RemoveAll(p => !p.IsSinglePlayer && !p.IsCooperative);
            var after = _players.Count;

            Logger.Log($"Filtered {after} from {before} players.");
            return Task.CompletedTask;
        }
        private async Task Ex(string path, object obj)
        {
            if (File.Exists(path))
                File.Delete(path);
            await File.WriteAllTextAsync(path, JsonConvert.SerializeObject(obj));
        }
        public async Task Export()
        {
            await Ex($"{App.CurDir}players.json", _players);

            await Ex($"{App.Api}wrs.json", _wrs);
            await Ex($"{App.ApiBoards}sp.json", _scoreboard.Where(sb => sb.Mode == Portal2MapType.SinglePlayer));
            await Ex($"{App.ApiBoards}coop.json", _scoreboard.Where(sb => sb.Mode == Portal2MapType.Cooperative));
            await Ex($"{App.ApiBoards}overall.json", _scoreboard.Where(sb => sb.Mode == Portal2MapType.Unknown));

            var profiles = new List<ProfileModel>();
            foreach (var player in _players)
            {
                if (player.ProfileDownloaded)
                    profiles.Add(new ProfileModel(player));
                await Ex($"{App.ApiPlayers}{player.Id}.json", new PlayerModel(player));
            }
            await Ex($"{App.Api}profiles.json", profiles);

            await _stats.Export($"{App.CurDir}stats.json");
            await _stats.Export($"{App.Api}stats.json");
        }
        public async Task Import()
        {
            if (!File.Exists($"{App.CurDir}players.json")) return;
            _players = JsonConvert.DeserializeObject<List<Player>>(await File.ReadAllTextAsync($"{App.CurDir}players.json"));
            await _stats.Import($"{App.CurDir}stats.json");

            foreach (var player in _players)
                player.CalculateTotalScore();

            Logger.Log($"Imported {_players.Count} players from players.json");
        }
        public async Task CreateBoards(int maxRank = 10)
        {
            var cache = new Dictionary<ulong, IPublicProfile>();

            // Local function
            async Task Cache(IEnumerable<Player> players, int perfectScore, Portal2MapType mode)
            {
                var rank = 0;
                var current = 0;
                var rows = new List<string>();
                foreach (var player in players
                    .OrderBy(p => p.GetTotalScore(mode))
                    .ThenBy(p => p.Id))
                {
                    var score = player.GetTotalScore(mode);

                    if (current != score)
                    {
                        ++rank;
                        if (rank > maxRank) break;
                        current = score;
                    }

                    _scoreboard.Add(new ScoreboardEntry()
                    {
                        Rank = rank,
                        Id = player.Id,
                        Score = current,
                        Mode = mode
                    });

                    // Download Steam profile to resolve name + avatar
                    if (!cache.ContainsKey(player.Id) && string.IsNullOrEmpty(player.ProfileName))
                    {
                        var profile = await _client.GetProfileAsync(player.Id);
                        cache.Add(player.Id, profile);
                        player.AvatarLink = profile.AvatarIcon;
                        player.ProfileName = profile.Name;
                        await Task.Delay(500);
                        Logger.Log($"[{player.Id}] {score} by {cache[player.Id].Name}");
                    }
                }
            }

            var maxsp = _wrs
                .Where(x => x.Mode == Portal2MapType.SinglePlayer)
                .Where(x => !x.Excluded)
                .Sum(x => x.WorldRecord);
            var maxmp = _wrs
                .Where(x => x.Mode == Portal2MapType.Cooperative)
                .Where(x => !x.Excluded)
                .Sum(x => x.WorldRecord);

            await Cache(_players.Where(p => p.IsSinglePlayer), (int)maxsp, Portal2MapType.SinglePlayer);
            await Cache(_players.Where(p => p.IsCooperative), (int)maxmp, Portal2MapType.Cooperative);
            await Cache(_players.Where(p => p.IsOverall), (int)(maxsp + maxmp), Portal2MapType.Unknown);
        }
    }
}
