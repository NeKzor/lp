import React from 'react';
import Flag from 'react-world-flags';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import ProfileTable from './ProfileTable';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
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

const ProfileStat = ({ title, score, delta, percentage }) => (
    <>
        <Tooltip placement="top" title={score !== 0 ? `${score - delta}+${delta}` : ''} disableFocusListener disableTouchListener>
            <Typography variant="h3" gutterBottom>
                {percentage !== 0 ? percentage : 0}%
            </Typography>
        </Tooltip>
        <Typography variant="subtitle1" gutterBottom>
            {title}
        </Typography>
    </>
);

const ProfileDialog = ({ active, profile, handleClickClose }) => {
    const classes = useStyles();

    return (
        <>
            <Dialog fullScreen open={active} onClose={handleClickClose} TransitionComponent={Transition}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Tooltip placement="bottom" title="Open Steam profile" disableFocusListener disableTouchListener>
                            {profile ? (
                                <>
                                    <Button color="inherit" onClick={() => gotoSteamProfile(profile._id)}>
                                        <Avatar src={profile.avatar} />
                                    </Button>
                                    <Typography variant="h6" color="inherit" className={classes.flex}>
                                        &nbsp;&nbsp;&nbsp;{profile.name}
                                        {profile.country && (
                                            <>
                                                &nbsp;&nbsp;&nbsp;
                                                <Flag
                                                    code={profile.country}
                                                    style={{ position: 'relative', top: '2px' }}
                                                    height="15"
                                                    alt={profile.country}
                                                />
                                            </>
                                        )}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="circle" width={40} height={40} />
                                    <Skeleton style={{ marginLeft: '10px' }} variant="text" width={200} />
                                    <Typography className={classes.flex} />
                                </>
                            )}
                        </Tooltip>
                        <Tooltip placement="bottom" title="Close profile" disableFocusListener disableTouchListener>
                            <IconButton color="inherit" onClick={handleClickClose}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                {profile ? (
                    <>
                        <Grid container className={classes.stats}>
                            <Grid item xs={false} md={1} lg={3} />
                            <Grid item xs={12} md={10} lg={6}>
                                {profile.entries.length !== 0 && (
                                    <Grid container spacing={10}>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <Paper className={classes.paper}>
                                                <ProfileStat
                                                    title="Single Player"
                                                    score={profile.sp}
                                                    delta={profile.stats.sp.delta}
                                                    percentage={profile.stats.sp.percentage}
                                                />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <Paper className={classes.paper}>
                                                <ProfileStat
                                                    title="Cooperative"
                                                    score={profile.mp}
                                                    delta={profile.stats.mp.delta}
                                                    percentage={profile.stats.mp.percentage}
                                                />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <Paper className={classes.paper}>
                                                <ProfileStat
                                                    title="Overall"
                                                    score={profile.overall}
                                                    delta={profile.stats.overall.delta}
                                                    percentage={profile.stats.overall.percentage}
                                                />
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
                    </>
                ) : profile === undefined ? (
                    <LinearProgress />
                ) : (
                    <Grid style={{ height: '100%' }} container className={classes.records}>
                        <Grid item xs={false} md={1} lg={2} />
                        <Grid item xs={12} md={10} lg={9}>
                            <Paper>
                                <Typography variant="h5" gutterBottom style={{ padding: '50px 0px 50px 50px' }}>
                                    Profile not found :(
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Dialog>
        </>
    );
};

export default ProfileDialog;
