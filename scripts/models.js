const cache = require('./cache');

class Score {
    constructor(map, score) {
        this._id = map.id;
        this.mode = map.mode;
        this.score = score;
    }
}

class Player {
    constructor(id) {
        this._id = id;
        this.entries = [];
        this.sp = 0;
        this.spCount = 0;
        this.mp = 0;
        this.mpCount = 0;
        this.overall = 0;
        this.isBanned = false;
    }
}

class Portal2 {
    constructor() {
        this.maps = [];
        this.spMapCount = 0;
        this.mpMapCount = 0;

        this.overrides = cache.create('overrides.yaml');
        this.community = cache.create('community.yaml');

        this.ties = cache.create('ties.json');
        this.cheaters = cache.create('cheaters.json');
    }
    update() {
        this.maps = cache.create('records.yaml').read();

        this.spMapCount = 0;
        this.mpMapCount = 0;
        this.perfectSpScore = 0;
        this.perfectMpScore = 0;

        for (const map in this.maps) {
            if (map.mode === 1) {
                ++this.spMapCount;
                this.perfectSpScore += map.wr;
            } else {
                ++this.mpMapCount;
                this.perfectMpScore += map.wr;
            }
        }

        this.perfectScore = this.perfectSpScore + this.perfectMpScore;
    }
}

module.exports = { Score, Player, Portal2 };
