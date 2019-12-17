import React from 'react';

class DarkMode {
    constructor() {
        this.enabled = localStorage.getItem('dark_mode') === 'true';
    }
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('dark_mode', this.enabled.toString());
        return this;
    }
}

class Profile {
    constructor() {
        this.current = '';
        this.cache = {};
    }
    set({ id, data }) {
        this.current = id;
        this.cache[id] = data;
        return this;
    }
    clear() {
        this.current = '';
        return this;
    }
    get() {
        return this.cache[this.current];
    }
}

const inititalState = {
    records: [],
    cheaters: [],
    profile: new Profile(),
    darkMode: new DarkMode(),
};

export const AppReducer = [
    (state, { action, data }) => {
        console.log('[DISPATCH] ' + action);
        switch (action) {
            case 'setRecords':
                return {
                    ...state,
                    records: data.maps || [],
                    cheaters: data.cheaters || [],
                };
            case 'setProfile':
                data.data.entries.forEach((e) => {
                    let map = state.records.find((r) => r.id === e._id);
                    e.name = map.name;
                    e.index = map.index;
                    e.delta = Math.abs(map.wr - e.score);
                    e.showcase = map.showcases.find((sc) => sc.player.id === data.data._id);
                });
                return {
                    ...state,
                    profile: state.profile.set(data),
                };
            case 'clearProfile':
                return {
                    ...state,
                    profile: state.profile.clear(),
                };
            case 'toggleDarkMode':
                return {
                    ...state,
                    darkMode: state.darkMode.toggle(),
                };
            default:
                throw new Error('Unknown action type.');
        }
    },
    inititalState,
];

export default React.createContext(inititalState);
