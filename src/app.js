import React from 'react';
import PropTypes from 'prop-types';
import AppBar from './components/appBar';
import ProfileDialog from './components/profileDialog';
import AboutView from './views/aboutView';
import RecordsView from './views/recordsView';
import ScoreboardView from './views/scoreboardView';
import { withContext } from './withContext';
import { withRoot } from './withRoot';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    views: {
        marginTop: theme.spacing.unit * 3,
    },
});

class App extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        records: PropTypes.array.isRequired,
        playerCache: PropTypes.object.isRequired,
        cacheProfile: PropTypes.func.isRequired,
        clearProfile: PropTypes.func.isRequired,
    };

    state = {
        currentTab: 0,
    };

    handleTabChange = (_, currentTab) => {
        this.setState({ currentTab });
    };

    render() {
        const {
            classes,
            boards: {
                sp,
                coop,
                overall,
            },
            records,
            stats,
            currentProfile,
            playerCache,
            cacheProfile,
            clearProfile,
        } = this.props;

        const { currentTab } = this.state;

        return (
            <>
                <AppBar currentTab={currentTab} onTabChange={this.handleTabChange} />
                {records.length !== 0 &&
                    <div className={classes.views}>
                        {currentTab === 0 && <ScoreboardView data={sp} boardType="sp" dialogOpener={cacheProfile} />}
                        {currentTab === 1 && <ScoreboardView data={coop} boardType="coop" dialogOpener={cacheProfile} />}
                        {currentTab === 2 && <ScoreboardView data={overall} boardType="overall" dialogOpener={cacheProfile} />}
                        {currentTab === 3 && <RecordsView data={records} />}
                        {currentTab === 4 && <AboutView data={stats} />}
                    </div>
                }
                {currentProfile &&  
                    <ProfileDialog
                        dialogOpen={currentProfile !== null}
                        handleClose={clearProfile}
                        data={playerCache[currentProfile]}
                        profileId={currentProfile}
                    />
                }
            </>
        );
    }
}

export default withRoot(withContext(withStyles(styles)(App)));
