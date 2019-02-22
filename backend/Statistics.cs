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

        [JsonIgnore]
        private string _file { get; set; }
        [JsonIgnore]
        private string _copy { get; set; }

        public Statistics(string file)
        {
            _file = App.CurDir + file;
            TiedRecords = new Dictionary<ulong, int>();
            Cheaters = new HashSet<ulong>();
        }

        public int GetRecordCount(ulong id)
            => TiedRecords.GetValueOrDefault(id);
        public void SetRecordCount(ulong id, int count)
            => TiedRecords.Add(id, count);
        public void AddCheater(ulong id)
            => Cheaters.Add(id);
        public bool IsCheater(ulong id)
            => Cheaters.Contains(id);

        public async Task Export()
        {
            ExportDate = System.DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss '(UTC)'");
            if (File.Exists(_file)) File.Delete(_file);
            await File.WriteAllTextAsync(_file, JsonConvert.SerializeObject(this, Formatting.Indented));
        }
        public async Task Import()
        {
            if (!File.Exists(_file)) return;
            var stats = JsonConvert.DeserializeObject<Statistics>(await File.ReadAllTextAsync(_file));
            TiedRecords = stats.TiedRecords;
            Cheaters = stats.Cheaters;
        }
    }
}
