const fs = require('fs');
const assert = require('assert');
const { showcasesFile } = require('../scripts/config');
const SteamWebClient = require('../scripts/steam');

require('dotenv').config();

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');

describe('Test updater', () => {
    describe('#createShowcases()', () => {
        it('should fetch all profiles correctly', async () => {
            const showcases = JSON.parse(fs.readFileSync(showcasesFile, 'utf-8'));

            const expected = Array.from(new Set(showcases.filter((sc) => sc.steam).map((sc) => sc.steam)));
            const actual = await steam.fetchProfiles(expected);

            assert.equal(actual.length, expected.length);
        });
    });
});
