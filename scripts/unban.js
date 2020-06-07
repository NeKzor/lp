const fs = require('fs');
const moment = require('moment');
const PouchDB = require('pouchdb');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

const log = (msg) => console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);

const db = new PouchDB('database', { auto_compaction: true, revs_limit: 1 });

const setBan = async (_id, newBan) => {    
    const player = (await db.find({ selector: { _id } })).docs[0];

    if (!player) {
        return log(_id + ' is not in db');
    }

    if (player.isBanned == newBan) {
        return log(_id + ' is already ' + (newBan ? 'banned' : 'unbanned'));
    }

    player.isBanned = newBan;
    log(_id + ' has been ' + (newBan ? 'banned' : 'unbanned'));

    await db.put(player);
};

const id = process.argv[2];
const ban = process.argv[3] === '--ban' || false;

if (!id) {
    throw Error("Missing steam id as argument");
}

setBan(id, ban);
