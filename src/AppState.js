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

const inititalState = {
    records: [],
    cheaters: [],
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
