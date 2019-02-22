import React from 'react';
import AppBar from './components/appBar';
import ProfileDialog from './components/profileDialog';
import AboutView from './views/aboutView';
import RecordsView from './views/recordsView';
import ScoreboardView from './views/scoreboardView';
import { withContext } from './withContext';
import { withRoot } from './withRoot';

class App extends React.PureComponent {
    state = {
        currentTab: 0,
    };

    handleTabChange = (_, currentTab) => {
        this.setState({ currentTab });
    };

    render() {
        const {
            boards: { sp,
                coop,
                overall
            },
            records,
            stats,
            currentProfile,
            playerCache,
            cacheProfile,
            clearProfile
        } = this.props;

        const { currentTab } = this.state;

        return (
            <>
                <AppBar currentTab={currentTab} onTabChange={this.handleTabChange} />
                {currentTab === 0 && <ScoreboardView data={sp} dialogOpener={cacheProfile} />}
                {currentTab === 1 && <ScoreboardView data={coop} dialogOpener={cacheProfile} />}
                {currentTab === 2 && <ScoreboardView data={overall} dialogOpener={cacheProfile} />}
                {currentTab === 3 && <RecordsView data={records} />}
                {currentTab === 4 && <AboutView data={stats} />}
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

export default withRoot(withContext(App));
