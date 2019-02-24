using System.Collections.Generic;
using Newtonsoft.Json;
using Portal2Boards.Extensions;

namespace nekzor.github.io.lp
{
    internal class PlayerModel
    {
        [JsonProperty("sp_score")]
        public int SinglePlayerScore { get; set; }
        [JsonProperty("coop_score")]
        public int CooperativeScore { get; set; }
        [JsonProperty("overall_score")]
        public int OverallScore { get; set; }
        [JsonProperty("entries")]
        public List<ScoreEntry> Entries { get; set; }

        public PlayerModel(Player player)
        {
            SinglePlayerScore = player.GetTotalScore(Portal2MapType.SinglePlayer);
            CooperativeScore = player.GetTotalScore(Portal2MapType.Cooperative);
            OverallScore = player.GetTotalScore(Portal2MapType.Unknown);
            Entries = player.Entries;
        }
    }
}
