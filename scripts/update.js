const PouchDB = require('pouchdb');
const crontab = require('node-cron');
const api = require('./api');
const globalCache = require('./cache');
const config = require('./config');
const { Player, Score, Portal2 } = require('./models');
const SteamWebClient = require('./steam');
const { log, goTheFuckToSleep } = require('./utils');

PouchDB.plugin(require('pouchdb-find'));
require('dotenv').config();

if (!process.env.STEAM_API_KEY) {
    throw new Error('Steam API key not defined!');
}

const { maxFetchRank, maxBoardRank } = config;

const steam = new SteamWebClient(process.env.STEAM_API_KEY, 'nekzor.github.io.lp.2.0');
const db = new PouchDB('database');
const game = new Portal2();

const resetAll = async () => {
    const result = await db.allDocs();

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

const updatePlayer = (player, map, score) => {
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
    const maps = game.maps.read();
    const overrides = game.overrides.read();
    const ties = game.ties.readOrCreate({});

    let count = 0;
    for (let map of maps) {
        log.info(`{blueBright [${map.id}]} ${map.name} (${++count}/${maps.length})`);

        ties[map.id] = 0;

        const cache = globalCache.create(`lb/${map.id}.json`);

        let steamLb = null;
        try {
            steamLb = cache.read();
            log.info('from cache');
        } catch {}

        if (!steamLb) {
            await goTheFuckToSleep(500);
            steamLb = await steam.fetchLeaderboard('Portal2', map.id, 1, maxFetchRank);
            log.success('fetched');

            let start = steamLb.entryEnd + 1;
            let end = start + steamLb.resultCount;

            let limit = map.limit !== undefined ? map.limit : map.wr;

            while (steamLb.entries.entry[steamLb.entries.entry.length - 1].score === limit) {
                await goTheFuckToSleep(500);
                let nextPage = await steam.fetchLeaderboard('Portal2', map.id, start, end);
                log.success(`fetched another page (${start}-${end})`);

                if (!nextPage) {
                    log.warn('fetch failed, retry in 30 seconds');
                    await goTheFuckToSleep(30000);
                    continue;
                }

                if (!nextPage.entries.entry.length) {
                    break;
                }

                steamLb.entries.entry.push(...nextPage.entries.entry);

                start = nextPage.entryEnd + 1;
                end = start + nextPage.resultCount;
            }

            cache.save(steamLb);
        }

        for (let entry of steamLb.entries.entry) {
            // fast-xml-parser is weird sometimes :>
            let steamid = entry.steamid.toString();

            let result = await db.find({ selector: { _id: steamid } });
            let doc = result.docs[0];
            let player = doc ? doc : new Player(steamid);

            if (player.isBanned) {
                continue;
            }

            let score = entry.score;

            if (score < map.wr) {
                let ovr = overrides.find((x) => x.id === map.id && x.player === steamid);
                if (ovr) {
                    log.warn(`override score ${score} -> ${ovr.score} : ${steamid}`);
                    score = ovr.score;
                } else {
                    log.warn(`invalid score ${score} : ${steamid}`);
                    player.isBanned = true;
                    await db.put(player);
                    continue;
                }
            }

            updatePlayer(player, map, score);

            if (score === map.wr) {
                ++ties[map.id];
            }

            await db.put(player);
        }
    }

    delete maps;

    game.ties.save(ties);
};

const filterAll = async () => {
    const cheaters = game.cheaters.readOrCreate([]);

    const maps = game.maps.read();
    const spMapCount = maps.filter((m) => m.mode === 1).length;
    const mpMapCount = maps.filter((m) => m.mode === 2).length;
    delete maps;

    const result = await db.allDocs();
    for (let row of result.rows) {
        let player = await db.get(row.id);

        if (player.isBanned) {
            cheaters.push(player._id);
            continue;
        }

        // Complete all maps in sp or coop
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

    game.cheaters.save(cheaters);
    delete cheaters;
};

const createBoard = async (field, stats) => {
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

    const { perfectSpScore, perfectMpScore } = stats;
    const perfectScore = perfectSpScore + perfectMpScore;

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

            api.export('/profile/' + player._id, player);
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

    api.export(
        field,
        players.filter((p) => p.rank),
    );
};

const exportAll = async () => {
    const maps = game.maps.read();

    const stats = {
        perfectSpScore: maps.filter((m) => m.mode === 1).map((m) => m.wr).reduce((acc, val) => acc + val, 0), // prettier-ignore
        perfectMpScore: maps.filter((m) => m.mode === 2).map((m) => m.wr).reduce((acc, val) => acc + val, 0), // prettier-ignore
    };

    await createBoard('sp', stats);
    await createBoard('mp', stats);
    await createBoard('overall', stats);

    const showcases = game.community.read();

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

    const ties = game.ties.read();

    maps.forEach((map) => {
        map.ties = ties[map.id];
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

    delete ties;
    delete showcases;

    const cheaters = game.cheaters.read();
    api.export('records', { maps, cheaters });

    delete maps;
    delete cheaters;
};

const main = async () => {
    try {
        await globalCache.reload();
        await resetAll();
        await runUpdates();
        await filterAll();
        await exportAll();

        ghPages.publish(
            output,
            {
                repo: `https://${process.env.GITHUB_TOKEN}@github.com/NeKzBot/lp.git`,
                silent: true,
                branch: 'api',
                message: 'Update',
                user: {
                    name: 'NeKzBot',
                    email: '44978126+NeKzBot@users.noreply.github.com',
                },
            },
            (err) => (err ? log.error(err) : log.success('Published')),
        );
    } catch (err) {
        log.error(err);
    }
};

crontab.scheduleJob('0 12 * * *', main);
