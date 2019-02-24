using System;
using System.Globalization;
using Newtonsoft.Json;

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
}
