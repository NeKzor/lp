class Client {
    constructor() {
        this.baseApi = 'https://raw.githubusercontent.com/NeKzor/lp/api';
    }
    async get(route) {
        console.log(`Fetching ${route}`);
        return await fetch(this.baseApi + route + '.json');
    }
    async getProfiles() {
        let res = await this.get('/profiles');
        return await res.json();
    }
    async getRecords() {
        let res = await this.get('/wrs');
        return await res.json();
    }
    async getStats() {
        let res = await this.get('/stats');
        return await res.json();
    }
    async getBoard(board) {
        if (board !== 'sp' && board !== 'coop' && board !== 'overall')
            throw new Error('Invalid board!');
        let res = await this.get(`/boards/${board}`);
        return await res.json();
    }
    async getPlayer(id) {
        let res = await this.get(`/players/${id}`);
        return await res.json();
    }
}

export default Client;
