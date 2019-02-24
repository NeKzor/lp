using Newtonsoft.Json;

namespace nekzor.github.io.lp
{
    internal class CacheItem
    {
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("score")]
        public int Score { get; set; }
    }
}
