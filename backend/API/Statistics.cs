using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace nekzor.github.io.lp
{
    internal class Statistics
    {
        [JsonProperty("tied_records")]
        public Dictionary<ulong, int> TiedRecords { get; set; }
        [JsonProperty("cheaters")]
        public HashSet<ulong> Cheaters { get; set; }
        [JsonProperty("export_date")]
        public string ExportDate { get; set; }

        public Statistics()
        {
            TiedRecords = new Dictionary<ulong, int>();
            Cheaters = new HashSet<ulong>();
        }

        public int GetRecordCount(ulong id)
            => TiedRecords.GetValueOrDefault(id);
        public void SetRecordCount(ulong id, int count)
            => TiedRecords[id] = count;
        public void AddCheater(ulong id)
            => Cheaters.Add(id);
        public bool IsCheater(ulong id)
            => Cheaters.Contains(id);

        public async Task Export(string file)
        {
            ExportDate = System.DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss '(UTC)'");
            if (File.Exists(file)) File.Delete(file);
            await File.WriteAllTextAsync(file, JsonConvert.SerializeObject(this));
        }
        public async Task Import(string file)
        {
            if (!File.Exists(file))
            {
                await Export(file);
                return;
            }

            var stats = JsonConvert.DeserializeObject<Statistics>(await File.ReadAllTextAsync(file));
            TiedRecords = stats.TiedRecords;
            Cheaters = stats.Cheaters;
        }
    }
}
