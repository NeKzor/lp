import React from 'react';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ScoresTable from '../components/ScoresTable';
import AppState from '../AppState';
import Api from '../Api';
import { useIsMounted } from '../Hooks';
import ProfileDialog from '../components/ProfileDialog';

const ScoreboardView = ({ boardType, profileId }) => {
    const isMounted = useIsMounted();

    const [board, setBoard] = React.useState([]);
    const [profile, setProfile] = React.useState(undefined);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const {
        state: { records },
    } = React.useContext(AppState);

    const prepareProfile = (profile) => {
        if (profile) {
            profile.entries.forEach((entry) => {
                let map = records.find((record) => record.id === entry._id);
                entry.name = map.name;
                entry.index = map.index;
                entry.delta = Math.abs(map.wr - entry.score);
                entry.showcase = map.showcases.find((sc) => sc.player.id === profile._id || (sc.player2 && sc.player2.id === profile._id));
            });
        }
        return profile;
    };

    React.useEffect(() => {
        if (profile === undefined && profileId) {
            setDialogOpen(true);

            Api.getProfile(profileId)
                .then((profile) => isMounted.current && setProfile(prepareProfile(profile)))
                .catch((err) => console.error(err));
        } else if (board.length === 0) {
            Api.getBoard(boardType)
                .then((board) => isMounted.current && setBoard(board))
                .catch((err) => console.error(err));
        }
    }, []);

    const handleProfileOpen = (id) => () => {
        setDialogOpen(true);

        Api.getProfile(id)
            .then((profile) => isMounted.current && setProfile(prepareProfile(profile)))
            .catch((err) => console.error(err));
    };

    const handleProfileClose = () => {
        setDialogOpen(false);

        if (board.length === 0) {
            Api.getBoard(boardType)
                .then((board) => isMounted.current && setBoard(board))
                .catch((err) => console.error(err));
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={false} md={1} lg={3} />
                <Grid item xs={12} md={10} lg={6}>
                    <Paper style={{ marginBottom: '50px' }}>
                        {board.length === 0 && <LinearProgress />}
                        <ScoresTable data={board} handleClickOpen={handleProfileOpen} />
                    </Paper>
                </Grid>
            </Grid>
            <ProfileDialog active={dialogOpen} profile={profile} handleClickClose={handleProfileClose} />
        </>
    );
};

export default ScoreboardView;
