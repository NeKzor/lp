const fetch = require('cross-fetch');
const xml = require('fast-xml-parser');

const parserConfig = { parseTrueNumberOnly: true };

const parseXml = (text) => {
    return new Promise((resolve) => resolve(xml.parse(text, parserConfig)));
};

class SteamWebClient {
    constructor(apiKey, userAgent) {
        this.apiKey = apiKey;
        this.config = {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            },
        };
    }
    async fetchLeaderboards(gameName) {
        let res = await fetch(`https://steamcommunity.com/stats/${gameName}/leaderboards?xml=1`, this.config).catch((error) =>
            console.error(error),
        );
        let txt = await res.text();
        let xml = await parseXml(txt);
        return xml.response;
    }
    async fetchLeaderboard(gameName, id, start = '', end = '') {
        let res = await fetch(
            `https://steamcommunity.com/stats/${gameName}/leaderboards/${id}?xml=1&start=${start}&end=${end}`,
            this.config,
        ).catch((error) => console.error(error));
        let txt = await res.text();
        let xml = await parseXml(txt);
        return xml.response;
    }
    async fetchProfiles(profileIds) {
        let ids = profileIds.join(',');
        let res = await fetch(
            `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${ids}`,
            this.config,
        ).catch((error) => console.error(error));
        let json = await res.json();
        return json.response.players;
    }
}

module.exports = SteamWebClient;
