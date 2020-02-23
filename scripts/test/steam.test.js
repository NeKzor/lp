const assert = require('assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const SteamWebClient = require('../steam');

require('dotenv').config();

if (!process.env.STEAM_API_KEY) {
    console.log('[INFO] STEAM_API_KEY is missing');
    return;
}

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');

describe('Test valid steam ids in showcase file', () => {
    it('should fetch all profiles correctly', async () => {
        const file = fs.readFileSync(path.join(__dirname, '/../../community.yaml'), 'utf-8');
        const showcases = yaml.safeLoad(file);

        const ids = [];
        for (const { steam, steam2 } of showcases) {
            if (steam) ids.push(steam);
            if (steam2) ids.push(steam2);
        }

        const expected = Array.from(new Set(ids));

        assert.ok(expected.length <= 100, 'cannot handle more than 100 ids');

        const actual = await steam.fetchProfiles(expected);

        assert.equal(actual.length, expected.length, 'failed to fetch one or more profile from steam');
    });
});
