class Score {
    constructor(map, score) {
        this._id = map.id;
        this.mode = map.mode;
        this.score = score;
        this.delta = Math.abs(map.wr - score);
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

module.exports = { Score, Player };
