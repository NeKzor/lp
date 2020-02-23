const assert = require('assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Test valid yaml files', () => {
    it('should parse community.yaml correctly', async () => {
        const file = fs.readFileSync(path.join(__dirname, '/../../community.yaml'), 'utf-8');
        const showcases = yaml.safeLoad(file);

        for (const showcase of showcases) {
            if (showcase.steam !== undefined) {
                assert.equal(typeof showcase.steam, 'string', 'Steam id is not a string');
            }
            if (showcase.steam2 !== undefined) {
                assert.equal(typeof showcase.steam2, 'string', 'partner Steam id is not a string');
            }
            if (showcase.player !== undefined) {
                assert.equal(typeof showcase.player, 'string', 'player name is not a string');
            }
            if (showcase.player2 !== undefined) {
                assert.equal(typeof showcase.player2, 'string', 'partner name is not a string');
            }

            assert.notEqual(showcase.id, undefined, 'map id is missing');
            assert.notEqual(showcase.date, undefined, 'date is missing');
            assert.notEqual(showcase.media, undefined, 'media url is missing');

            assert.equal(typeof showcase.id, 'number', 'map id is not a number');
            assert.equal(typeof showcase.date, 'string', 'date is not a string');
            assert.equal(typeof showcase.media, 'string', 'media url is not a string');

            assert.ok(showcase.id >= 0, 'map id cannot be negative');
        }
    });

    it('should parse overrides.yaml correctly', async () => {
        const file = fs.readFileSync(path.join(__dirname, '/../../overrides.yaml'), 'utf-8');
        const overrides = yaml.safeLoad(file);

        for (const override of overrides) {
            assert.notEqual(override.id, undefined, 'map id is missing');
            assert.notEqual(override.player, undefined, 'player id is missing');
            assert.notEqual(override.score, undefined, 'score is missing');

            assert.equal(typeof override.id, 'number', 'map id is not a number');
            assert.equal(typeof override.player, 'string', 'player id is not a string');
            assert.equal(typeof override.score, 'number', 'score is not a number');
        }
    });

    it('should parse records.yaml correctly', async () => {
        const file = fs.readFileSync(path.join(__dirname, '/../../records.yaml'), 'utf-8');
        const maps = yaml.safeLoad(file);

        assert.equal(maps.length, 99, 'map count is not 99');

        for (const map of maps) {
            assert.notEqual(map.id, undefined, 'map id is missing');
            assert.notEqual(map.name, undefined, 'map name is missing');
            assert.notEqual(map.mode, undefined, 'campaign mode is missing');
            assert.notEqual(map.wr, undefined, 'wr score is missing');
            assert.notEqual(map.index, undefined, 'map index is missing');

            assert.equal(typeof map.id, 'number', 'map id is not a number');
            assert.equal(typeof map.name, 'string', 'map name is not a string');
            assert.equal(typeof map.mode, 'number', 'campaign mode is not a number');
            assert.equal(typeof map.wr, 'number', 'wr score is not a number');
            assert.equal(typeof map.index, 'number', 'map index is not a number');

            assert.ok(map.id >= 0, 'map id cannot be negative');
            assert.ok(map.mode >= 0, 'map mode cannot be negative');
            assert.ok(map.wr >= 0, 'wr score cannot be negative');
            assert.ok(map.index >= 0, 'map index cannot be negative');

            if (map.limit !== undefined) {
                assert.equal(typeof map.limit, 'number', 'score limit is not a number');
            }
        }

        assert.equal(maps.filter((map) => map.mode === 1).length, 51, 'sp map count is not 51');
        assert.equal(maps.filter((map) => map.mode === 2).length, 48, 'mp map count is not 48');
    });
});
