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

const useStyles = makeStyles((theme) => ({
    stats: {
        marginTop: theme.spacing(3),
    },
    records: {
        marginTop: theme.spacing(3),
    },
    flex: {
        flex: 1,
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
}));

const Transition = (props) => {
    return <Slide direction="up" {...props} />;
};

const gotoSteamProfile = (id) => {
    let tab = window.open(`https://steamcommunity.com/profiles/${id}`, '_blank');
    tab.opener = null;
};

const ProfileDialog = () => {
    const isMounted = useIsMounted();
    const { state: { profile }, dispatch } = React.useContext(AppState);

    const handleProfileClose = () => isMounted.current && dispatch({ action: 'clearProfile' });

    const classes = useStyles();

    if (!profile.get()) {
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
                            <IconButton color="inherit" onClick={handleProfileClose} aria-label="Close">
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
                            <Grid container spacing={24}>
                                <Grid item xs={12} md={4} lg={4}>
                                    <Paper className={classes.paper}>
                                        <Tooltip
                                            placement="top"
                                            title={
                                                profile.sp !== 0
                                                    ? `${profile.stats.sp.profile - profile.stats.sp.delta}+${profile.stats.sp.delta}`
                                                    : ''
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
                                                profile.mp !== 0
                                                    ? `${profile.stats.mp.score - profile.stats.mp.delta}+${profile.stats.mp.delta}`
                                                    : ''
                                            }
                                            disableFocusListener
                                            disableTouchListener
                                        >
                                            <Typography variant="h3" gutterBottom>
                                                {profile.stats.mp.percentage !== 0 ? profile.mp.percentage : 0}%
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
                        <Paper>
                            <ProfileTable data={profile.entries} />
                        </Paper>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
};

export default ProfileDialog;
