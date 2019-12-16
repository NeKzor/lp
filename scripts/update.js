const fs = require('fs');
const path = require('path');
const PouchDB = require('pouchdb');
const config = require('./config');
const { Player, Score } = require('./models');
const SteamWebClient = require('./steam');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

const { apiFolder, mapFile, overridesFile, cacheFolder, maxFetchRank, maxBoardRank } = config;

const maps = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));

const spMapCount = maps.filter((m) => m.mode === 1).length;
const mpMapCount = maps.filter((m) => m.mode === 2).length;
const perfectSpScore = maps.filter((m) => m.mode === 1).map((m) => m.wr).reduce((acc, val) => acc + val, 0); // prettier-ignore
const perfectMpScore = maps.filter((m) => m.mode === 2).map((m) => m.wr).reduce((acc, val) => acc + val, 0); // prettier-ignore
const perfectScore = perfectSpScore + perfectMpScore;

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');
const db = new PouchDB('database');

let cheaters = [];

const exportApi = (route, data) => fs.writeFileSync(path.join(apiFolder, route) + '.json', JSON.stringify({ data }));
const goTheFuckToSleep = (ms) => new Promise((res) => setTimeout(res, ms));

const resetAll = async () => {
    let result = await db.allDocs();

    for (let row of result.rows) {
        let player = await db.get(row.id);
        player.sp = 0;
        player.spCount = 0;
        player.mp = 0;
        player.mpCount = 0;
        player.overall = 0;
        await db.put(player);
    }
};

const update = (player, map, score) => {
    let entry = player.entries.find((e) => e._id === map.id);
    if (entry) {
        entry.score = score;
        entry.delta = Math.abs(map.wr - score);
    } else {
        player.entries.push(new Score(map, score));
    }

    if (map.mode === 1) {
        player.sp += score;
        ++player.spCount;
    } else {
        player.mp += score;
        ++player.mpCount;
    }

    player.overall += score;
};

const runUpdates = async () => {
    const overrides = JSON.parse(fs.readFileSync(overridesFile, 'utf-8'));
    const total = spMapCount + mpMapCount;

    maps.forEach((m) => (m.ties = 0));

    let count = 0;
    for (let map of maps) {
        console.log(`[${map.id}] ${map.name} (${++count}/${total})`);
        const cache = `${cacheFolder}/${map.id}.json`;

        let steamLb = null;
        try {
            steamLb = JSON.parse(fs.readFileSync(cache, 'utf-8')).data;
            console.log(`[${map.id}] from cache`);
        } catch {}

        if (!steamLb) {
            await goTheFuckToSleep(500);
            steamLb = await steam.fetchLeaderboard('Portal2', map.id, 1, maxFetchRank);
            console.log(`[${map.id}] fetched`);

            let start = steamLb.entryEnd + 1;
            let end = start + steamLb.resultCount;

            let limit = map.limit !== undefined ? map.limit : map.wr;

            while (steamLb.entries.entry[steamLb.entries.entry.length - 1].score === limit) {
                await goTheFuckToSleep(500);
                let nextPage = await steam.fetchLeaderboard('Portal2', map.id, start, end);
                console.log(`[${map.id}] fetched another page`);

                if (!nextPage.entries.entry.length) {
                    break;
                }

                steamLb.entries.entry.push(...nextPage.entries.entry);

                start = nextPage.entryEnd + 1;
                end = start + nextPage.resultCount;
            }

            fs.writeFileSync(cache, JSON.stringify({ data: steamLb }));
        }

        for (let entry of steamLb.entries.entry) {
            let score = entry.score;

            // fast-xml-parser is weird sometimes :>
            let steamid = entry.steamid.toString();

            let result = await db.find({ selector: { _id: steamid } });
            let doc = result.docs[0];
            let player = doc ? doc : new Player(steamid);

            if (player.isBanned) {
                //console.log('ignoring banned player ' + steamid);
                continue;
            }

            if (score >= map.wr) {
                update(player, map, score);

                if (score === map.wr) {
                    ++map.ties;
                }
            } else {
                let ovr = overrides.find((x) => x.id === map.id && x.player === steamid);
                if (ovr) {
                    console.log(`override player ${steamid} with score ${score}`);
                    update(player, map, ovr.score);

                    if (score === map.wr) {
                        ++map.ties;
                    }
                } else {
                    console.log(`banned player ${steamid} with score ${score}`);
                    player.isBanned = true;
                }
            }

            await db.put(player);
        }
    }
};

// Delete all players who did not complete all maps in sp OR coop
const filterAll = async () => {
    cheaters = [];

    let result = await db.allDocs();

    console.log(result);
    for (let row of result.rows) {
        let player = await db.get(row.id);

        if (player.isBanned) {
            cheaters.push(player._id);
            await db.remove(player);
            continue;
        }

        console.log(`${player._id} : ${player.spCount}/${spMapCount} : ${player.mpCount}/${mpMapCount}`);

        if (player.spCount !== spMapCount) {
            player.sp = 0;
            player.overall = 0;
        }
        if (player.mpCount !== mpMapCount) {
            player.mp = 0;
            player.overall = 0;
        }

        if (player.sp > 0 || player.mp > 0) {
            await db.put(player);
        } else {
            await db.remove(player);
        }
    }
};

const createBoard = async (field) => {
    await db.createIndex({ index: { fields: [field] } });

    let players = await db.find({ selector: { [field]: { $gt: 0 } }, limit: maxBoardRank, sort: [field] });

    let profiles = await steam.fetchProfiles(players.docs.map((p) => p._id));

    for (let player of players.docs) {
        let profile = profiles.find((p) => p.steamid.toString() === player._id);
        if (!profile) {
            console.log('unable to fetch profile of ' + player._id);
            continue;
        }

        player.name = profile.personaname;
        player.avatar = profile.avatar;
        player.country = profile.loccountrycode;

        player.stats = {
            sp: {
                delta: Math.abs(player.sp - perfectSpScore),
                percentage: player.sp !== 0 ? Math.round((perfectSpScore / player.sp) * 100) : 0,
            },
            mp: {
                delta: Math.abs(player.mp - perfectMpScore),
                percentage: player.mp !== 0 ? Math.round((perfectMpScore / player.mp) * 100) : 0,
            },
            overall: {
                delta: Math.abs(player.overall - perfectScore),
                percentage: player.sp !== 0 && player.mp !== 0 ? Math.round((perfectScore / player.overall) * 100) : 0,
            },
        };

        console.log(player._id + ' -> ' + player.name);
        exportApi('/profile/' + player._id, player);

        delete player.entries;
    }

    exportApi(field, players.docs);
};

const createShowcases = async () => {
    const showcases = require('../community');

    const profiles = await steam.fetchProfiles(Array.from(new Set(showcases.filter((sc) => sc.steam).map((sc) => sc.steam))));

    maps.forEach((map) => {
        map.showcases = [];

        showcases.forEach(({ id, steam, player, date, media }) => {
            if (id === map.id) {
                let profile = profiles.find((p) => p.steamid.toString() === steam);

                map.showcases.push({
                    player: profile
                        ? {
                              name: profile.personaname,
                              avatar: profile.avatar,
                              country: profile.loccountrycode,
                          }
                        : {
                              name: player,
                          },
                    date,
                    media,
                });
            }
        });
    });
};

const main = async () => {
    try { fs.mkdirSync(cacheFolder); } catch {} // prettier-ignore
    try { fs.mkdirSync(apiFolder); } catch {} // prettier-ignore
    try { fs.mkdirSync(path.join(apiFolder, '/profile')); } catch {} // prettier-ignore

   /*  await resetAll();
    await runUpdates();
    await filterAll();

    await createBoard('sp');
    await createBoard('mp');
    await createBoard('overall');

    await db.close(); */

    await createShowcases();

    exportApi('records', { maps, cheaters });
};

if (process.env.UPDATE === 'yes') {
    main().catch((err) => console.error(err));
}
