const fs = require('fs');
const moment = require('moment');
const path = require('path');
const PouchDB = require('pouchdb');
const config = require('./config');
const { Player } = require('./models');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

const log = (msg) => console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);

const { cacheFolder } = config;

const statsFile = path.join(cacheFolder, 'stats.json');
const stats = JSON.parse(fs.readFileSync(path.join(cacheFolder, 'stats.json'), 'utf-8'));
const updateStats = () => fs.writeFileSync(statsFile, JSON.stringify(stats, null, 4), 'utf-8');

const db = new PouchDB('database');

const cache = () => {
    let cheaters = JSON.parse(fs.readFileSync('./scripts/old/2019-09-11.json')).cheaters;

    for (cheater of cheaters) {
        if (stats.cheaters.find((x) => x === cheater)) {
            continue;
        }

        log(cheater + ' was not in cache');
        stats.cheaters.push(cheater);
    }

    updateStats();
};

const ban = async () => {
    for (let _id of stats.cheaters) {
        let cheater = (await db.find({ selector: { _id } })).docs[0];

        if (!cheater) {
            cheater = new Player(_id);
            log(_id + ' banned (was not in db)');
        } else if (cheater.isBanned) {
            log(_id + ' already banned');
            continue;
        } else {
            log(_id + ' banned');
        }

        cheater.isBanned = true;
        await db.put(cheater);
    }
};

ban().catch((err) => console.error(err));
