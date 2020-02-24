const chalk = require('chalk');
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

    for (const row of result.rows) {
        const player = await db.get(row.id);
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
    const entry = player.entries.find((e) => e._id === map.id);
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
    const overrides = game.overrides.read();
    const ties = game.ties.readOrCreate({});

    const amount = game.maps.length;
    let count = 0;

    for (const map of game.maps) {
        log.info(chalk`{blueBright [${map.id}]} ${map.name} (${++count}/${amount})`);

        ties[map.id] = 0;

        const cache = globalCache.create(`lb/${map.id}.json`);

        let steamLb = null;
        try {
            steamLb = cache.read();
            log.info('from cache');
        } catch (err) {}

        if (!steamLb) {
            await goTheFuckToSleep(500);

            let steamLb = null;
            do {
                steamLb = await steam.fetchLeaderboard('Portal2', map.id, 1, maxFetchRank);
                if (!steamLb) {
                    log.warn('fetch failed, retry in 30 seconds');
                    await goTheFuckToSleep(30000);
                }
            } while (!steamLb);

            log.success('fetched');

            let start = steamLb.entryEnd + 1;
            let end = start + steamLb.resultCount;

            const limit = map.limit !== undefined ? map.limit : map.wr;

            while (steamLb.entries.entry[steamLb.entries.entry.length - 1].score === limit) {
                await goTheFuckToSleep(500);
                const nextPage = await steam.fetchLeaderboard('Portal2', map.id, start, end);

                if (!nextPage) {
                    log.warn('fetch failed, retry in 30 seconds');
                    await goTheFuckToSleep(30000);
                    continue;
                }

                log.success(`fetched another page (${start}-${end})`);

                if (!nextPage.entries.entry.length) {
                    break;
                }

                steamLb.entries.entry.push(...nextPage.entries.entry);

                start = nextPage.entryEnd + 1;
                end = start + nextPage.resultCount;
            }

            cache.save(steamLb);
        }

        for (const entry of steamLb.entries.entry) {
            // fast-xml-parser is weird sometimes :>
            const steamid = entry.steamid.toString();

            const result = await db.find({ selector: { _id: steamid } });
            const doc = result.docs[0];
            const player = doc ? doc : new Player(steamid);

            if (player.isBanned) {
                continue;
            }

            const score = entry.score;

            if (score < map.wr) {
                const ovr = overrides.find((x) => x.id === map.id && x.player === steamid);
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

    game.ties.save(ties);
};

const filterAll = async () => {
    const cheaters = game.cheaters.readOrCreate([]);

    const { rows } = await db.allDocs();
    for (const row of rows) {
        const player = await db.get(row.id);

        if (player.isBanned) {
            cheaters.push(player._id);
            continue;
        }

        // Complete all maps in sp or coop
        if (player.spCount !== game.spMapCount) {
            player.sp = 0;
            player.overall = 0;
        }
        if (player.mpCount !== game.mpMapCount) {
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
};

const createBoard = async (board) => {
    const players = (await db.find({ selector: { [board]: { $gt: 0 } } })).docs.sort((a, b) => {
        if (a[board] === b[board]) {
            return a._id - b._id;
        }
        return a[board] - b[board];
    });

    const profiles = await steam.fetchProfiles(players.filter((p) => p.name === undefined).map((p) => p._id));

    let rank = 0;
    let current = 0;

    const { perfectScore, perfectSpScore, perfectMpScore } = game;

    for (const player of players) {
        if (current !== player[board]) {
            current = player[board];
            ++rank;
        }

        if (rank > maxBoardRank) {
            break;
        }

        if (player.name === undefined) {
            const profile = profiles.find((p) => p.steamid.toString() === player._id);
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

        player.stats = player.stats[board];
        player.score = player[board];
        player.scoreOld = player[board + 'Old'];

        delete player.sp;
        delete player.mp;
        delete player.overall;
        delete player.spOld;
        delete player.mpOld;
        delete player.overallOld;

        player.rank = rank;
    }

    api.export(
        board,
        players.filter((p) => p.rank),
    );
};

const exportAll = async () => {
    await createBoard('sp');
    await createBoard('mp');
    await createBoard('overall');

    const showcases = game.community.read();

    const ids = [];
    for (const { steam, steam2 } of showcases) {
        if (steam) ids.push(steam);
        if (steam2) ids.push(steam2);
    }

    const profiles = await steam.fetchProfiles(Array.from(new Set(ids)));

    const findProfile = (id, name) => {
        const profile = profiles.find((p) => p.steamid.toString() === id);
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

    for (const map of game.maps) {
        map.ties = ties[map.id];
        map.showcases = [];

        for (const showcase of showcases) {
            if (showcase.id === map.id) {
                map.showcases.push({
                    player: findProfile(showcase.steam, showcase.player),
                    player2: map.mode === 2 ? findProfile(showcase.steam2, showcase.player2) : undefined,
                    date: showcase.date,
                    media: showcase.media,
                });
            }
        }
    }

    api.export('records', { maps: game.maps, cheaters: game.cheaters.read() });
};

const main = async () => {
    try {
        await globalCache.reload();

        game.update();

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

const schedule = () => {
    crontab.schedule('0 12 * * *', main);
};

if (process.argv[2] === 'now') {
    main().then(schedule);
} else {
    schedule();
}
