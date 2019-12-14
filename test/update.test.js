const fs = require('fs');
const assert = require('assert');
const { showcasesFile } = require('../scripts/config');
const { maps, createShowcases } = require('../scripts/update');

describe('Test updater', () => {
    describe('#createShowcases()', () => {
        it('should fetch all profiles correctly', async () => {
            await createShowcases();

            const actual = maps.map(m => m.showcases).reduce((acc, val) => acc.concat(val), []);
            const expected = JSON.parse(fs.readFileSync(showcasesFile, 'utf-8'));

            assert.equal(actual.length, expected.length);
        });
    });
});
