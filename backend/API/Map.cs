using Newtonsoft.Json;
using Portal2Boards.Extensions;

namespace nekzor.github.io.lp
{
    internal class Map
    {
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("mode")]
        public Portal2MapType Mode { get; set; }
        [JsonProperty("wr")]
        public int WorldRecord { get; set; }
        [JsonProperty("excluded")]
        public bool Excluded { get; set; }
        [JsonProperty("index")]
        public uint Index { get; set; }
    }
}
