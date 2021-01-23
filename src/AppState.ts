import React from 'react';

class User {
    profile: any = null;

    constructor() {
        this.profile = null;
    }
    hasLoaded() {
        return this.profile;
    }
    isLoggedIn() {
        return this.profile && !this.profile.error;
    }
    setProfile(profile: any) {
        this.profile = profile;
        return this;
    }
}

class DarkMode {
    enabled = false;

    constructor() {
        this.enabled = localStorage.getItem('dark_mode') === 'true';
    }
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('dark_mode', this.enabled.toString());
        return this;
    }
}

type AppState = {
    records: any[];
    user: User;
    darkMode: DarkMode;
};

export const initialAppState: AppState = {
    records: [],
    user: new User(),
    darkMode: new DarkMode(),
};

type ActionType =
    | { action: 'setProfile'; data: any }
    | { action: 'setRecords'; data: any }
    | { action: 'toggleDarkMode' };

export const appReducer = (state: typeof initialAppState, dispatch: ActionType) => {
    console.log('[DISPATCH] ' + dispatch.action);
    switch (dispatch.action) {
        case 'setProfile':
            return {
                ...state,
                user: state.user.setProfile(dispatch.data),
            };
        case 'setRecords':
            return {
                ...state,
                records: dispatch.data.maps || [],
            };
        case 'toggleDarkMode':
            return {
                ...state,
                darkMode: state.darkMode.toggle(),
            };
        default:
            throw new Error('Unknown action type.');
    }
};

type ContextType = {
    state: typeof initialAppState;
    dispatch: React.Dispatch<ActionType>;
};

export default React.createContext<ContextType>({ state: initialAppState, dispatch: () => {} });
