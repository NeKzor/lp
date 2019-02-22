import React from 'react';
import profiles from './api/profiles.json';
import wrs from './api/wrs.json';
import stats from './api/stats.json';
import board_sp from './api/boards/sp.json';
import board_coop from './api/boards/coop.json';
import board_overall from './api/boards/overall.json';
import jsonPlayer from './api/players/76561198049848090.json';
import { AppContext } from './withContext';

class ContextProvider extends React.Component {
    perfectScores = {
        sp: 0,
        coop: 0,
        overall: 0,
    };

    state = {
        profiles: [],
        records: [],
        stats: [],
        boards: {
            sp: [],
            coop: [],
            overall: []
        },
        currentProfile: null,
        playerCache: {},
        calcWrDelta: (entry) => Math.abs(this.state.findRecord(entry.id).wr - entry.score),
        findRecord: (id) => this.state.records.find(r => r.id === id),
        findProfile: (id) => this.state.profiles.find(p => p.id === id),
        cacheProfile: (id) => this.cacheProfile(id),
        clearProfile: () => this.setState({ currentProfile: null }),
    };

    componentDidMount() {
        /* fetch('https://raw.githubusercontent.com/NeKzor/lp/api/profiles.json')
            .then(res => res.json())
            .then(profilesJson => this.setState({ profiles: profilesJson }));
        fetch('https://raw.githubusercontent.com/NeKzor/lp/api/wrs.json')
            .then(res => res.json())
            .then(recordsJson => {
                fetch('https://raw.githubusercontent.com/NeKzor/lp/api/stats.json')
                    .then(res => res.json())
                    .then(statsJson => {
                        initRecords(statsJson, recordsJson);
                        this.setState({ records: recordsJson, stats: statsJson });
                    });
            }); */

        this.initRecords(stats.tied_records, wrs);
        this.initBoards(board_sp, 'sp');
        this.initBoards(board_coop, 'coop');
        this.initBoards(board_overall, 'overall');
        this.setState({
            records: wrs,
            stats: stats,
            profiles: profiles,
            boards: {
                sp: board_sp,
                coop: board_coop,
                overall: board_overall
            }
        }, () => console.log(this.state));
    }

    initBoards(board, type) {
        let that = this;
        for (let item of board) {
            item.getProfile = function () {
                return that.state.profiles.find(p => p.id === this.id);
            };
            if (type === 'sp') {
                item.getStats = function () {
                    return {
                        delta: that.perfectScores.sp - this.score,
                        percentage: Math.round(that.perfectScores.sp / this.score * 100)
                    };
                };
            } else if (type === 'coop') {
                item.getStats = function () {
                    return {
                        delta: that.perfectScores.coop - this.score,
                        percentage: Math.round(that.perfectScores.coop / this.score * 100)
                    };
                };
            } else {
                item.getStats = function () {
                    return {
                        delta: that.perfectScores.overall - this.score,
                        percentage: Math.round(that.perfectScores.overall / this.score * 100)
                    };
                };
            }
        }
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

    cacheProfile(profileId) {
        if (this.state.playerCache[profileId] === undefined) {
            /* fetch(`https://raw.githubusercontent.com/NeKzor/lp/api/players/${profileId}.json`)
                .then(res => res.json())
                .then(jsonPlayer => { */
            let entries = [];
            for (let entry of jsonPlayer.entries) {
                entries.push({
                    id: entry.id,
                    name: this.state.findRecord(entry.id).name,
                    score: entry.score,
                    wrDelta: this.state.calcWrDelta(entry),
                    video: null
                });
            }

            let profile = this.state.findProfile(profileId);

            this.setState((prevState) => ({
                currentProfile: profileId,
                playerCache: {
                    ...prevState.playerCache,
                    [profileId]: {
                        profile: {
                            name: profile.profile_name,
                            avatar: profile.avatar_link,
                        },
                        sp: jsonPlayer.sp_score,
                        coop: jsonPlayer.coop_score,
                        overall: jsonPlayer.overall_score,
                        entries: entries
                    }
                }
            }));
            /* }); */
        } else {
            this.setState({ currentProfile: profileId });
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
