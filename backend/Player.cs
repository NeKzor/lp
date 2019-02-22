using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Newtonsoft.Json;
using Portal2Boards.Extensions;

namespace nekzor.github.io.lp
{
    internal sealed class UlongConverter : JsonConverter
    {
        public override bool CanRead => false;
        public override bool CanWrite => true;
        public override bool CanConvert(Type type)
            => type == typeof(ulong);
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            => writer.WriteValue(((ulong)value).ToString(CultureInfo.InvariantCulture));
        public override object ReadJson(JsonReader reader, Type type, object value, JsonSerializer serializer)
            => throw new NotImplementedException();
    }

    internal class Player2
    {
        [JsonProperty("sp_score")]
        public int SinglePlayerScore { get; set; }
        [JsonProperty("coop_score")]
        public int CooperativeScore { get; set; }
        [JsonProperty("overall_score")]
        public int OverallScore { get; set; }
        [JsonProperty("entries")]
        public List<ScoreEntry> Entries { get; set; }

        public Player2(Player player)
        {
            SinglePlayerScore = player.GetTotalScore(Portal2MapType.SinglePlayer);
            CooperativeScore = player.GetTotalScore(Portal2MapType.Cooperative);
            OverallScore = player.GetTotalScore(Portal2MapType.Unknown);
            Entries = player.Entries;
        }
    }

    internal class Profile
    {
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("profile_name")]
        public string ProfileName { get; set; }
        [JsonProperty("avatar_link")]
        public string AvatarLink { get; set; }

        public Profile(Player player)
        {
            Id = player.Id;
            ProfileName = player.ProfileName;
            AvatarLink = player.AvatarLink;
        }
    }

    internal class Player
    {
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("profile_name")]
        public string ProfileName { get; set; }
        [JsonProperty("avatar_link")]
        public string AvatarLink { get; set; }
        [JsonProperty("entries")]
        public List<ScoreEntry> Entries { get; set; }

        [JsonIgnore]
        private int _singlePlayerScore { get; set; }
        [JsonIgnore]
        private int _cooperativeScore { get; set; }
        [JsonIgnore]
        private int _totalScore => _singlePlayerScore + _cooperativeScore;

        [JsonIgnore]
        public bool IsSinglePlayer => _singlePlayerScore != default;
        [JsonIgnore]
        public bool IsCooperative => _cooperativeScore != default;
        [JsonIgnore]
        public bool IsOverall => IsSinglePlayer && IsCooperative;

        [JsonIgnore]
        public bool ProfileDownloaded => !string.IsNullOrEmpty(ProfileName) && !string.IsNullOrEmpty(AvatarLink);

        public Player()
        {
            Entries = new List<ScoreEntry>();
        }
        public Player(ulong id, IEnumerable<Portal2Map> campaign) : this()
        {
            Id = id;
            foreach (var map in campaign)
            {
                Entries.Add(new ScoreEntry()
                {
                    Id = (ulong)map.BestPortalsId,
                    Mode = map.Type
                });
            }
        }

        public void Update(int id, int score)
        {
            Entries.First(x => x.Id == (ulong)id).Score = score;
        }
        public void Merge(Player player)
        {
            Entries.AddRange(player.Entries);
            player.Entries.Clear();
        }
        public void CalculateTotalScore()
        {
            var sp = Entries.Where(e => e.Mode == Portal2MapType.SinglePlayer);
            var mp = Entries.Where(e => e.Mode == Portal2MapType.Cooperative);

            if (!sp.Any(x => x.Score == default))
                _singlePlayerScore = (int)sp.Sum(e => e.Score);
            if (!mp.Any(x => x.Score == default))
                _cooperativeScore = (int)mp.Sum(e => e.Score);
        }
        public int GetTotalScore(Portal2MapType mode)
        {
            switch (mode)
            {
                case Portal2MapType.SinglePlayer:
                    return _singlePlayerScore;
                case Portal2MapType.Cooperative:
                    return _cooperativeScore;
            }
            return _singlePlayerScore + _cooperativeScore;
        }
    }
}
