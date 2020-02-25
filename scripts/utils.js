const chalk = require('chalk');
const moment = require('moment');

const goTheFuckToSleep = (ms) => new Promise((res) => setTimeout(res, ms));
const tryCatch = (callback) => { try { callback(); } catch (err) { log.error(err); } }; // prettier-ignore
const tryCatchIgnore = (callback) => { try { callback(); } catch (err) {} }; // prettier-ignore

const datePrefix = () => `[${moment().format('YYYY-MM-DD')}] [${moment().format('HH:mm:ss')}]`;
const log = {
    info:    (msg) => console.log(chalk`{bold.white ${datePrefix()}} ${msg}`), // prettier-ignore
    success: (msg) => console.log(chalk`{bold.white ${datePrefix()}} {greenBright ${msg}}`), // prettier-ignore
    warn:    (msg) => console.log(chalk`{bold.white ${datePrefix()}} {yellowBright ${msg}}`), // prettier-ignore
    error:   (msg) => {
        console.log(chalk`{bold.white ${datePrefix()}} {redBright ${msg}}`);
        console.error(msg);
    },
};

module.exports = {
    goTheFuckToSleep,
    tryCatch,
    tryCatchIgnore,
    log,
};
