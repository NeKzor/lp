const fs = require('fs');
const moment = require('moment');
const PouchDB = require('pouchdb');
const { Player } = require('./models');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

const log = (msg) => console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);

const db = new PouchDB('database', { auto_compaction: true });

const backup1 = JSON.parse(fs.readFileSync('./scripts/old/2019-09-11.json')).cheaters;
const backup2 = JSON.parse(fs.readFileSync('./scripts/old/2020-04-22.json')).data.cheaters;

const ban = async (cheaters) => {    
    for (const _id of cheaters) {
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

ban(backup1).catch((err) => console.error(err));
ban(backup2).catch((err) => console.error(err));
