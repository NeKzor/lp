// v1

type BoardType = 'sp' | 'mp' | 'overall';

class Api {
    get baseApi() {
        return process.env.NODE_ENV === 'development' ? '/api/v1' : 'https://next.lp.nekz.me/api/v1';
    }
    async request(route: string) {
        const res = await fetch(route);
        console.log(`[GET] ${route} (${res.status})`);
        return res;
    }
    async getRecords() {
        const res = await this.request(`${this.baseApi}/records`);
        return res.ok ? (await res.json()).data : {};
    }
    async getBoard(board: BoardType) {
        if (board !== 'sp' && board !== 'mp' && board !== 'overall') throw new Error('Invalid board!');

        const res = await this.request(`${this.baseApi}/${board}`);
        return res.ok ? (await res.json()).data : {};
    }
    async getProfile(id: string) {
        const res = await this.request(`${this.baseApi}/profiles/${id}`);
        return res.ok ? (await res.json()).data : null;
    }
}

export default new Api();

class ApiClient {
    baseApi: string;
    options: RequestInit;

    constructor(baseApi: string) {
        this.baseApi = baseApi;
        this.options = {
        };
    }
    async get(route: string) {
        const res = await fetch(this.baseApi + route,  { method: 'GET', ...this.options });
        console.log(`[GET] ${this.baseApi + route} (${res.status})`);
        return res;
    }
    async patch(route: string, body: any) {
        const res = await fetch(this.baseApi + route, { method: 'PATCH', body, ...this.options });
        console.log(`[PATCH] ${this.baseApi + route} (${res.status})`);
        return res;
    }
    async post(route: string, body: any) {
        const res = await fetch(this.baseApi + route, { method: 'POST', body, ...this.options });
        console.log(`[POST] ${this.baseApi + route} (${res.status})`);
        return res;
    }
}

// v2
class ApiService {
    client: ApiClient;

    constructor() {
        this.client = new ApiClient(
            process.env.NODE_ENV === 'development' ? '' : 'https://next.lp.nekz.me'
        );
    }
    async getMe() {
        const res = await this.client.get('/users/@me');
        return await res.json();
    }
    async getUser(steamId: string) {
        const res = await this.client.get(`/users/${steamId}`);
        return await res.json();
    }
    async getUsers() {
        const res = await this.client.get('/users/all');
        return await res.json();
    }
    async editUser(user: any) {
        const res = await this.client.patch('/users/edit', user);
        return await res.json();
    }
    async getLogs(filter: any) {
        const res = await this.client.post('/logs/all', filter);
        return await res.json();
    }
}

const api2 = new ApiService();

export { api2 };
