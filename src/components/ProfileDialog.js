import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import ProfileTable from './ProfileTable';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppState from '../AppState';
import { useIsMounted } from '../Hooks';
import RecordDeltaChart from './RecordDeltaChart';

const useStyles = makeStyles((theme) => ({
    stats: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        background: theme.palette.type === 'dark' ? theme.palette.grey['A400'] : theme.palette.grey['50'],
    },
    records: {
        paddingTop: theme.spacing(3),
        background: theme.palette.type === 'dark' ? theme.palette.grey['A400'] : theme.palette.grey['50'],
    },
    flex: {
        flex: 1,
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
}));

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" {...props} ref={ref} />;
});

const gotoSteamProfile = (id) => {
    let tab = window.open(`https://steamcommunity.com/profiles/${id}`, '_blank');
    tab.opener = null;
};

const ProfileDialog = () => {
    const isMounted = useIsMounted();
    const { state, dispatch } = React.useContext(AppState);

    const handleProfileClose = () => isMounted.current && dispatch({ action: 'clearProfile' });

    const profile = state.profile.get();

    const classes = useStyles();

    if (!profile) {
        return <React.Fragment />;
    }

    return (
        <>
            <Dialog fullScreen open={true} onClose={handleProfileClose} TransitionComponent={Transition}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Tooltip placement="bottom" title="Open Steam profile" disableFocusListener disableTouchListener>
                            <Button color="inherit" onClick={() => gotoSteamProfile(profile._id)}>
                                <Avatar src={profile.avatar} />
                            </Button>
                        </Tooltip>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            &nbsp;&nbsp;&nbsp;{profile.name}
                        </Typography>
                        <Tooltip placement="bottom" title="Close profile" disableFocusListener disableTouchListener>
                            <IconButton color="inherit" onClick={handleProfileClose}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                {(!profile.entries || profile.entries.length) === 0 && <LinearProgress />}
                <Grid container className={classes.stats}>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        {profile.entries.length !== 0 && (
                            <Grid container spacing={10}>
                                <Grid item xs={12} md={4} lg={4}>
                                    <Paper className={classes.paper}>
                                        <Tooltip
                                            placement="top"
                                            title={
                                                profile.sp !== 0 ? `${profile.sp - profile.stats.sp.delta}+${profile.stats.sp.delta}` : ''
                                            }
                                            disableFocusListener
                                            disableTouchListener
                                        >
                                            <Typography variant="h3" gutterBottom>
                                                {profile.stats.sp.percentage !== 0 ? profile.stats.sp.percentage : 0}%
                                            </Typography>
                                        </Tooltip>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Single Player
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <Paper className={classes.paper}>
                                        <Tooltip
                                            placement="top"
                                            title={
                                                profile.mp !== 0 ? `${profile.mp - profile.stats.mp.delta}+${profile.stats.mp.delta}` : ''
                                            }
                                            disableFocusListener
                                            disableTouchListener
                                        >
                                            <Typography variant="h3" gutterBottom>
                                                {profile.stats.mp.percentage !== 0 ? profile.stats.mp.percentage : 0}%
                                            </Typography>
                                        </Tooltip>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Cooperative
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <Paper className={classes.paper}>
                                        <Tooltip
                                            placement="top"
                                            title={
                                                profile.stats.overall.percentage !== 0
                                                    ? `${profile.overall - profile.stats.overall.delta}+${profile.stats.overall.delta}`
                                                    : ''
                                            }
                                            disableFocusListener
                                            disableTouchListener
                                        >
                                            <Typography variant="h3" gutterBottom>
                                                {profile.stats.overall.percentage !== 0 ? profile.stats.overall.percentage : 0}%
                                            </Typography>
                                        </Tooltip>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Overall
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid container className={classes.records}>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        <Paper style={{ marginBottom: '50px' }}>
                            <ProfileTable data={profile.entries} />
                        </Paper>
                        <Paper style={{ paddingTop: '10px', marginBottom: '50px' }}>
                            <RecordDeltaChart data={profile.entries} mode={1} title="Single Player" color="#2E93fA" />
                        </Paper>
                        <Paper style={{ paddingTop: '10px', marginBottom: '50px' }}>
                            <RecordDeltaChart data={profile.entries} mode={2} title="Cooperative" color="#FF9800" />
                        </Paper>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
};

export default ProfileDialog;
