const fetch = require('cross-fetch');
const xml = require('fast-xml-parser');
const { log } = require('./utils');

const parserConfig = { parseTrueNumberOnly: true };

const parseXml = (text) => {
    return new Promise((resolve) => resolve(xml.parse(text, parserConfig)));
};

const steamWebApi = 'https://steamcommunity.com';
const steamBaseApi = 'http://api.steampowered.com';

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
        try {
            const res = await fetch(`${steamWebApi}/stats/${gameName}/leaderboards?xml=1`, this.config);
            if (res.status >= 400) {
                return null;
            }

            const txt = await res.text();
            const xml = await parseXml(txt);
            return xml.response;
        } catch (err) {
            log.error(err);
            return null;
        }
    }
    async fetchLeaderboard(gameName, id, start = '', end = '') {
        try {
            const res = await fetch(`${steamWebApi}/stats/${gameName}/leaderboards/${id}?xml=1&start=${start}&end=${end}`, this.config);
            if (res.status >= 400) {
                return null;
            }

            const txt = await res.text();
            const xml = await parseXml(txt);
            return xml.response;
        } catch (err) {
            log.error(err);
            return null;
        }
    }
    async fetchProfiles(profileIds) {
        if (profileIds.length === 0) throw new Error('argument contains no ids');
        if (profileIds.length > 100) throw new Error('cannot fetch more than 100 ids');

        try {
            const ids = profileIds.join(',');
            const res = await fetch(`${steamBaseApi}/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${ids}`, this.config);
            if (res.status >= 400) {
                return null;
            }

            const json = await res.json();
            return json.response.players;
        } catch (err) {
            log.error(err);
            return null;
        }
    }
}

module.exports = SteamWebClient;
