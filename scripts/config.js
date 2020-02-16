const path = require('path');

module.exports = {
    apiFolder: path.join(__dirname, '/../api'),
    cacheFolder: path.join(__dirname, '/../cache'),
    maxFetchRank: 5000, // max 5000 per request
    maxBoardRank: 100, // max 100 per request
};
