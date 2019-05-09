using Newtonsoft.Json;

namespace nekzor.github.io.lp
{
    internal class Override
    {
        [JsonProperty("id")]
        public uint Id { get; set; }
        [JsonProperty("player")]
        public ulong Player { get; set; }
        [JsonProperty("score")]
        public int Score { get; set; }
    }
}
