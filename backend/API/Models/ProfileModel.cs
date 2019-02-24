using System.Collections.Generic;
using Newtonsoft.Json;

namespace nekzor.github.io.lp
{
    internal class ProfileModel
    {
        [JsonProperty("id")]
        public ulong Id { get; set; }
        [JsonProperty("profile_name")]
        public string ProfileName { get; set; }
        [JsonProperty("avatar_link")]
        public string AvatarLink { get; set; }

        public ProfileModel(Player player)
        {
            Id = player.Id;
            ProfileName = player.ProfileName;
            AvatarLink = player.AvatarLink;
        }
    }
}
