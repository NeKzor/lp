class Api {
    constructor() {
        this.baseApi =
            process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://raw.githubusercontent.com/NeKzBot/lp/api';
    }
    async request(route) {
        let res = await fetch(route);
        console.log(`[GET] ${route} (${res.status})`);
        return res;
    }
    async getRecords() {
        let res = await this.request(`${this.baseApi}/records.json`);
        return res.ok ? (await res.json()).data : {};
    }
    async getBoard(board) {
        if (board !== 'sp' && board !== 'mp' && board !== 'overall') throw new Error('Invalid board!');

        let res = await this.request(`${this.baseApi}/${board}.json`);
        return res.ok ? (await res.json()).data : {};
    }
    async getProfile(id) {
        let res = await this.request(`${this.baseApi}/profile/${id}.json`);
        return res.ok ? (await res.json()).data : null;
    }
}

export default new Api();
