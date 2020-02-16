const fs = require('fs');
const path = require('path');
const { apiFolder } = require('./config');
const { log } = require('./utils');

class Api {
    export(route, data) {
        fs.writeFileSync(path.join(apiFolder, route) + '.json', JSON.stringify({ data }));
        log.info(`exported ${route}`);
    }
}

module.exports = new Api();
