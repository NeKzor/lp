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
        switch (action) {
            case 'setRecords':
                return {
                    ...state,
                    records: data.maps || [],
                    cheaters: data.cheaters || [],
                };
            case 'setProfile':
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
