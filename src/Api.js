class Api {
    constructor() {
        window.BASE_API =
            process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080/api/v1' : 'http://lp.nekz.me/api/v1';
    }
    get baseApi() {
        return window.BASE_API;
    }
    async request(route) {
        const res = await fetch(route);
        console.log(`[GET] ${route} (${res.status})`);
        return res;
    }
    async getRecords() {
        const res = await this.request(`${this.baseApi}/records`);
        return res.ok ? (await res.json()).data : {};
    }
    async getBoard(board) {
        if (board !== 'sp' && board !== 'mp' && board !== 'overall') throw new Error('Invalid board!');

        const res = await this.request(`${this.baseApi}/${board}`);
        return res.ok ? (await res.json()).data : {};
    }
    async getProfile(id) {
        const res = await this.request(`${this.baseApi}/profiles/${id}`);
        return res.ok ? (await res.json()).data : null;
    }
}

export default new Api();
