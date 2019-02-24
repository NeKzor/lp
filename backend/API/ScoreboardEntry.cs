using Newtonsoft.Json;
using Portal2Boards.Extensions;

namespace nekzor.github.io.lp
{
    internal class ScoreboardEntry
    {
        [JsonProperty("rank")]
        public int Rank { get; set; }
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("score")]
        public int Score { get; set; }

        [JsonIgnore]
        public Portal2MapType Mode { get; set; }
    }
}
