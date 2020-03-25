const fs = require('fs');
const fetch = require('cross-fetch');
const yaml = require('js-yaml');
const path = require('path');
const { cacheFolder } = require('./config');
const { tryCatchIgnore } = require('./utils');

class CacheItem {
    constructor(file) {
        this.file = file;
    }
    read() {
        const content = fs.readFileSync(path.join(cacheFolder, this.file));

        if (this.file.endsWith('.yaml')) {
            return yaml.safeLoad(content);
        } else if (this.file.endsWith('.json')) {
            return JSON.parse(content, 'utf-8').data;
        }

        throw new Error('Can only read yaml or json files!');
    }
    readOrCreate(data) {
        if (!this.file.endsWith('.json')) {
            throw new Error('Can only read json files!');
        }

        try {
            const content = fs.readFileSync(path.join(cacheFolder, this.file));
            return JSON.parse(content, 'utf-8').data;
        } catch (err) {
            fs.writeFileSync(path.join(cacheFolder, this.file), JSON.stringify({ data }));
            return data;
        }
    }
    save(data) {
        if (!this.file.endsWith('.json')) {
            throw new Error('Can only read json files!');
        }

        fs.writeFileSync(path.join(cacheFolder, this.file), JSON.stringify({ data }));
    }
}

const repository = 'https://raw.githubusercontent.com/NeKzor/lp/master/';
const toFetch = ['community.yaml', 'overrides.yaml', 'records.yaml'];

class Cache {
    async reload() {
        const lbCache = path.join(cacheFolder, '/lb');
        tryCatchIgnore(() => fs.mkdirSync(cacheFolder));
        tryCatchIgnore(() => fs.rmdirSync(lbCache, { recursive: true }));
        tryCatchIgnore(() => fs.mkdirSync(lbCache));

        const responses = await Promise.all(toFetch.map((file) => fetch(repository + file)));

        let idx = 0;
        for (const res of responses) {
            if (res.status >= 400) {
                throw new Error('failed to fetch');
            }

            const text = await res.text();
            fs.writeFileSync(path.join(cacheFolder, toFetch[idx]), text);
            ++idx;
        }
    }
    create(file) {
        return new CacheItem(file);
    }
}

module.exports = new Cache();
