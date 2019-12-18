const fs = require('fs');
const path = require('path');
const PouchDB = require('pouchdb');
const config = require('./config');
const { Player, Score } = require('./models');
const SteamWebClient = require('./steam');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

const { apiFolder, mapFile, statsFile, overridesFile, cacheFolder, maxFetchRank, maxBoardRank } = config;

const maps = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));

const { ties, cheaters } = (() => {
    try {
        return JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    } catch {
        let stats = { ties: {}, cheaters: [] };
        maps.forEach((m) => (stats.ties[m.id] = 0));
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 4), 'utf-8');
        return stats;
    }
})();

const spMapCount = maps.filter((m) => m.mode === 1).length;
const mpMapCount = maps.filter((m) => m.mode === 2).length;
const perfectSpScore = maps.filter((m) => m.mode === 1).map((m) => m.wr).reduce((acc, val) => acc + val, 0); // prettier-ignore
const perfectMpScore = maps.filter((m) => m.mode === 2).map((m) => m.wr).reduce((acc, val) => acc + val, 0); // prettier-ignore
const perfectScore = perfectSpScore + perfectMpScore;

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');
const db = new PouchDB('database');

const exportApi = (route, data) => fs.writeFileSync(path.join(apiFolder, route) + '.json', JSON.stringify({ data }));
const goTheFuckToSleep = (ms) => new Promise((res) => setTimeout(res, ms));

const resetAll = async () => {
    let result = await db.allDocs();

    for (let row of result.rows) {
        let player = await db.get(row.id);
        player.spOld = player.sp;
        player.mpOld = player.mp;
        player.overallOld = player.overall;
        player.sp = 0;
        player.spCount = 0;
        player.mp = 0;
        player.mpCount = 0;
        player.overall = 0;
        player.name = undefined;
        player.avatar = undefined;
        player.country = undefined;
        player.stats = undefined;
        await db.put(player);
    }
};

const update = (player, map, score) => {
    let entry = player.entries.find((e) => e._id === map.id);
    if (entry) {
        entry.scoreOld = entry.score;
        entry.score = score;
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

    maps.forEach((m) => (ties[m.id] = 0));

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
                    ++ties[map.id];
                }
            } else {
                let ovr = overrides.find((x) => x.id === map.id && x.player === steamid);
                if (ovr) {
                    console.log(`override player ${steamid} with score ${score}`);
                    update(player, map, ovr.score);

                    if (score === map.wr) {
                        ++ties[map.id];
                    }
                } else {
                    console.log(`banned player ${steamid} with score ${score}`);
                    player.isBanned = true;
                }
            }

            await db.put(player);
        }
    }

    fs.writeFileSync(statsFile, JSON.stringify({ ties, cheaters }, null, 4), 'utf-8');
};

// Delete all players who did not complete all maps in sp OR coop
const filterAll = async () => {
    let result = await db.allDocs();

    for (let row of result.rows) {
        let player = await db.get(row.id);

        if (player.isBanned) {
            if (!cheaters.includes((c) => c === player._id)) {
                cheaters.push(player._id);
            }

            await db.remove(player);
            continue;
        }

        //console.log(`${player._id} : ${player.spCount}/${spMapCount} : ${player.mpCount}/${mpMapCount}`);

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

    fs.writeFileSync(statsFile, JSON.stringify({ ties, cheaters }, null, 4), 'utf-8');
};

const createBoard = async (field) => {
    let players = await db.find({ selector: { [field]: { $gt: 0 } } });

    players = players.docs.sort((a, b) => {
        if (a[field] === b[field]) {
            return a._id - b._id;
        }
        return a[field] - b[field];
    });

    let profiles = await steam.fetchProfiles(players.filter((p) => p.name === undefined).map((p) => p._id));

    let rank = 0;
    let current = 0;

    for (let player of players) {
        if (current !== player[field]) {
            current = player[field];
            ++rank;
        }

        if (rank > maxBoardRank) {
            break;
        }

        if (player.name === undefined) {
            let profile = profiles.find((p) => p.steamid.toString() === player._id);
            if (!profile) {
                throw Error('unable to fetch profile of ' + player._id);
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

            await db.put(player);

            delete player._rev;
            delete player.spCount;
            delete player.mpCount;
            delete player.isBanned;

            console.log(player._id + ' -> ' + player.name);
            exportApi('/profile/' + player._id, player);
        }

        delete player.entries;
        delete player._rev;
        delete player.spCount;
        delete player.mpCount;
        delete player.isBanned;

        player.stats = player.stats[field];
        player.score = player[field];
        player.scoreOld = player[field + 'Old'];

        delete player.sp;
        delete player.mp;
        delete player.overall;
        delete player.spOld;
        delete player.mpOld;
        delete player.overallOld;

        player.rank = rank;
    }

    exportApi(field, players.filter((p) => p.rank));
};

const createShowcases = async () => {
    const showcases = require('../community');

    let ids = [];
    showcases.forEach((sc) => {
        if (sc.steam) ids.push(sc.steam);
        if (sc.steam2) ids.push(sc.steam2);
    });

    const profiles = await steam.fetchProfiles(Array.from(new Set(ids)));

    const findProfile = (id, name) => {
        let profile = profiles.find((p) => p.steamid.toString() === id);
        return profile
            ? {
                  id,
                  name: profile.personaname,
                  avatar: profile.avatar,
                  country: profile.loccountrycode,
              }
            : {
                  name,
              };
    };

    maps.forEach((map) => {
        map.showcases = [];

        showcases.forEach((sc) => {
            if (sc.id === map.id) {
                map.showcases.push({
                    player: findProfile(sc.steam, sc.player),
                    player2: map.mode === 2 ? findProfile(sc.steam2, sc.player2) : undefined,
                    date: sc.date,
                    media: sc.media,
                });
            }
        });
    });
};

const main = async () => {
    try { fs.mkdirSync(cacheFolder); } catch {} // prettier-ignore
    try { fs.mkdirSync(apiFolder); } catch {} // prettier-ignore
    try { fs.mkdirSync(path.join(apiFolder, '/profile')); } catch {} // prettier-ignore

    await resetAll();
    await runUpdates();
    await filterAll();

    await createBoard('sp');
    await createBoard('mp');
    await createBoard('overall');

    await db.close();

    await createShowcases();

    maps.forEach((m) => (m.ties = ties[m.id]));

    exportApi('records', { maps, cheaters });
};

main().catch((err) => console.error(err));
