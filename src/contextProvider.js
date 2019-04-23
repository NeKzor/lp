import React from 'react';
import { AppContext } from './withContext';
import Client from './client.js';

class ContextProvider extends React.Component {
    state = {
        profiles: [],
        records: [],
        stats: [],
        currentProfile: null,
        boards: {
            sp: [],
            coop: [],
            overall: [],
        },
        calcWrDelta: (entry) => Math.abs(this.state.findRecord(entry.id).wr - entry.score),
        findRecord: (id) => this.state.records.find(r => r.id === id),
        findProfile: (id) => this.state.profiles.find(p => p.id === id),
        cacheProfile: (id) => this.cacheProfile(id),
        clearProfile: () => this.setState({ currentProfile: null }),
        downloadBoard: async (type) => await this.downloadBoard(type),
    };

    constructor() {
        super();
        this.api = new Client();
        this.perfectScores = {
            sp: 0,
            coop: 0,
            overall: 0,
        };
        this.playerCache = {};
    }

    async componentDidMount() {
        // Boards depend on profiles (name, avatar) and on records (perfect score)
        let profiles = await this.api.getProfiles();
        let records = await this.api.getRecords();

        // Records and About pages depend on stats (ties, number of cheaters, last update)
        let stats = await this.api.getStats();

        // Set ties to records page and calculate perfect score for each board
        this.initRecords(stats.tied_records, records);

        this.setState({ records, stats, profiles });
    }

    initRecords(ties, records) {
        for (let record of records) {
            record.ties = ties[record.id];
            if (!record.excluded) {
                if (record.mode === 1) {
                    this.perfectScores.sp += record.wr;
                } else if (record.mode === 2) {
                    this.perfectScores.coop += record.wr;
                }
                this.perfectScores.overall += record.wr;
            } else {
                record.ties = 0;
            }
        }
    }

    async downloadBoard(type) {
        let that = this;

        let board = await this.api.getBoard(type);
        for (let item of board) {
            item.getProfile = function () {
                if (this._profile === undefined) {
                    this._profile = that.state.profiles.find(p => p.id === this.id);
                }
                return this._profile;
            };
            if (type === 'sp') {
                item.getStats = function () {
                    if (this._stats === undefined) {
                        this._stats = {
                            delta: this.score - that.perfectScores.sp,
                            percentage: Math.round(that.perfectScores.sp / this.score * 100)
                        };
                    }
                    return this._stats;
                };
            } else if (type === 'coop') {
                item.getStats = function () {
                    if (this._stats === undefined) {
                        this._stats = {
                            delta: this.score - that.perfectScores.coop,
                            percentage: Math.round(that.perfectScores.coop / this.score * 100)
                        };
                    }
                    return this._stats;
                };
            } else if (type === 'overall') {
                item.getStats = function () {
                    if (this._stats === undefined) {
                        this._stats = {
                            delta: this.score - that.perfectScores.overall,
                            percentage: Math.round(that.perfectScores.overall / this.score * 100)
                        };
                    }
                    return this._stats;
                };
            } else {
                throw new Error('Invalid board type!');
            }
        }

        this.setState((prevState) => ({
            boards: {
                ...prevState.boards,
                [type]: board
            }
        }), () => console.log('Updated state:', this.state));
    }

    async cacheProfile(profileId) {
        let currentProfile = this.playerCache[profileId];
        if (currentProfile === undefined) {
            let profile = this.state.findProfile(profileId);
            currentProfile = {
                id: profileId,
                name: profile.profile_name,
                avatar: profile.avatar_link,
                sp: 0,
                coop: 0,
                overall: 0,
                entries: []
            };

            this.setState({ currentProfile });

            let { entries, sp_score, coop_score, overall_score } = await this.api.getPlayer(profileId);

            let records = [];
            for (let entry of entries) {
                records.push({
                    id: entry.id,
                    name: this.state.findRecord(entry.id).name,
                    score: entry.score,
                    wrDelta: this.state.calcWrDelta(entry)
                });
            }

            currentProfile = {
                ...currentProfile,
                sp: {
                    score: sp_score,
                    delta: sp_score - this.perfectScores.sp,
                    percentage: (sp_score !== 0) ? Math.round(this.perfectScores.sp / sp_score * 100) : 0,
                },
                coop: {
                    score: coop_score,
                    delta: coop_score - this.perfectScores.coop,
                    percentage: (coop_score !== 0) ? Math.round(this.perfectScores.coop / coop_score * 100) : 0,
                },
                overall: {
                    score: overall_score,
                    delta: overall_score - this.perfectScores.overall,
                    percentage: (sp_score !== 0 && coop_score !== 0) ? Math.round(this.perfectScores.overall / overall_score * 100) : 0,
                },
                entries: records,
            };

            this.setState({ currentProfile });

            this.playerCache = {
                ...this.playerCache,
                [profileId]: currentProfile
            };
        } else {
            console.log(`From cache: ${profileId}`);
            this.setState({ currentProfile });
        }
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default ContextProvider;
