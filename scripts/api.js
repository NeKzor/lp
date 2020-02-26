const fs = require('fs');
const path = require('path');
const ghPages = require('gh-pages');
const { apiFolder } = require('./config');
const { log } = require('./utils');

class Api {
    constructor() {
        const profileRoute = path.join(apiFolder, '/profile/');
        if (!fs.existsSync(apiFolder)) fs.mkdirSync(apiFolder);
        if (!fs.existsSync(profileRoute)) fs.mkdirSync(profileRoute);
    }
    export(route, data) {
        fs.writeFileSync(path.join(apiFolder, route) + '.json', JSON.stringify({ data }));
        log.info(`exported ${route}`);
    }
    publish() {
        ghPages.publish(
            apiFolder,
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
            (err) => (err ? log.error(err) : log.success('published')),
        );
    }
}

module.exports = new Api();
