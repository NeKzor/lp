const assert = require('assert');
const SteamWebClient = require('../scripts/steam');

require('dotenv').config();

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');

describe('Test valid steam ids in showcase file', () => {
    it('should fetch all profiles correctly', async () => {
        const showcases = require('../community');

        let ids = [];
        showcases.forEach((sc) => {
            if (sc.steam) ids.push(sc.steam);
            if (sc.steam2) ids.push(sc.steam2);
        });

        const expected = Array.from(new Set(ids));

        assert.ok(expected.length <= 100, 'cannot handle more than 100 ids');

        const actual = await steam.fetchProfiles(expected);

        assert.equal(actual.length, expected.length, 'failed to fetch one or more profile from steam');
    });
});
