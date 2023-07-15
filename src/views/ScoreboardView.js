import React from 'react';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ProfileDialog from '../components/ProfileDialog';
import ScoresTable from '../components/ScoresTable';
import Api from '../Api';
import AppState from '../AppState';
import { useIsMounted } from '../Hooks';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const ScoreboardView = ({ boardType, profileId }) => {
    const isMounted = useIsMounted();

    const [board, setBoard] = React.useState([]);
    const [profile, setProfile] = React.useState(undefined);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const {
        state: { records },
    } = React.useContext(AppState);

    const prepareProfile = React.useCallback(
        (profile) => {
            if (profile) {
                profile.entries.forEach((entry) => {

                    const map = records.find((record) => record.id === entry._id)
                        // small hack to fix issues with partial lists
                    ?? {name: "unknown", index: 0, wr: 0, showcases:[]};

                    entry.name = map.name;
                    entry.index = map.index;
                    entry.delta = entry.score - map.wr;
                    entry.showcase = map.showcases.find(
                        (sc) => sc.player.id === profile._id || (sc.player2 && sc.player2.id === profile._id),
                    );
                });

                const missing = [];
                records.forEach((record) => {
                    const entry = profile.entries.find((entry) => entry._id === record.id);
                    if (!entry) {
                        missing.push({
                            _id: record.id,
                            name: record.name,
                            index: record.index,
                        });
                    }
                });

                profile.entries.push(...missing);
            }
            return profile;
        },
        [records],
    );

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
    }, [board.length, boardType, isMounted, prepareProfile, profile, profileId]);

    const handleProfileOpen = (id) => () => {
        setDialogOpen(true);
        setProfile(undefined);

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
    const {
        state: { banned },
        dispatch,
    } = React.useContext(AppState);

    const toggleBanned = () => {
        dispatch({ action: 'toggleBanned' });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={false} md={1} lg={3} />
                <Grid item xs={12} md={10} lg={6}>
                    <Paper style={{ marginBottom: '50px' }}>
                        <FormGroup row style={{margin: '0px 10px', justifyContent: "right"}} >
                            <FormControlLabel
                                control={
                                    <Switch checked={banned.enabled} onChange={toggleBanned} color="primary" />
                                }
                                label="Show Banned Players"
                            />
                        </FormGroup>
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
