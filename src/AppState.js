import React from 'react';

class Toggle {
    constructor(name) {
        this.enabled = localStorage.getItem(name) === 'true';
        this.name = name;
    }
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem(this.name, this.enabled.toString());
        return this;
    }
}

const initialState = {
    records: [],
    darkMode: new Toggle("dark_mode"),
    banned: new Toggle("banned_toggle"),
};

export const AppReducer = [
    (state, { action, data }) => {
        console.log('[DISPATCH] ' + action);
        switch (action) {
            case 'setRecords':
                return {
                    ...state,
                    records: data.maps || [],
                };
            case 'toggleDarkMode':
                return {
                    ...state,
                    darkMode: state.darkMode.toggle(),
                };
            case 'toggleBanned':
                return {
                    ...state,
                    banned: state.banned.toggle(),
                };
            default:
                throw new Error('Unknown action type.');
        }
    },
    initialState,
];

export default React.createContext(initialState);
