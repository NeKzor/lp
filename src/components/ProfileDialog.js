import React from 'react';
import Flag from 'react-world-flags';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
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
    profile: {
        alignItems: 'center',
    },
    avatar: {
        cursor: 'pointer',
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginRight: 10,
    },
    playerLink: {
        cursor: 'pointer',
        marginRight: 10,
    },
    country: {
        marginTop: 8,
    },
}));

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" {...props} ref={ref} />;
});

const gotoSteamProfile = (id) => {
    const tab = window.open(`https://steamcommunity.com/profiles/${id}`, '_blank');
    tab.opener = null;
};

const ProfileStat = ({ title, type, data }) => {
    const score = data[type];
    const oldScore = data[type + 'Old'];
    const delta = data.stats[type].delta;
    const percentage = data.stats[type].percentage;

    return (
        <>
            <Tooltip
                placement="top"
                title={
                    score === 0 ? (
                        ''
                    ) : (
                        <div>
                            {`${score - delta}+${delta}`}
                            {score !== oldScore && (
                                <>
                                    <br />
                                    {oldScore + ' 🠊 ' + score}
                                </>
                            )}
                        </div>
                    )
                }
                disableFocusListener
                disableTouchListener
            >
                <Typography variant="h3" gutterBottom>
                    {percentage !== 0 ? percentage : 0}%
                </Typography>
            </Tooltip>
            <Typography variant="subtitle1" gutterBottom>
                {title}
            </Typography>
        </>
    );
};

const ProfileDialog = ({ active, profile, handleClickClose }) => {
    const classes = useStyles();

    return (
        <>
            <Dialog fullScreen open={active} onClose={handleClickClose} TransitionComponent={Transition}>
                <AppBar position="sticky">
                    <Toolbar>
                        {profile ? (
                            <Grid container direction="row" className={classes.profile}>
                                <Grid item>
                                    <Avatar
                                        onClick={() => gotoSteamProfile(profile._id)}
                                        className={classes.avatar}
                                        src={profile.avatar.slice(0, -4) + '_medium.jpg'}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="bottom"
                                        title="Open Steam profile"
                                        disableFocusListener
                                        disableTouchListener
                                    >
                                        <Typography variant="h6">
                                            <Link
                                                className={classes.playerLink}
                                                onClick={() => gotoSteamProfile(profile._id)}
                                                color="inherit"
                                            >
                                                {profile.name}
                                            </Link>
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                {profile.country && (
                                    <Grid item>
                                        <Flag
                                            className={classes.country}
                                            code={profile.country}
                                            height="15"
                                            alt={profile.country}
                                            title={profile.country}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        ) : (
                            <>
                                <Skeleton variant="circle" width={40} height={40} />
                                <Skeleton style={{ marginLeft: '10px' }} variant="text" width={200} />
                                <Typography className={classes.flex} />
                            </>
                        )}
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
                                                <ProfileStat title="Single Player" type="sp" data={profile} />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <Paper className={classes.paper}>
                                                <ProfileStat title="Cooperative" type="mp" data={profile} />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <Paper className={classes.paper}>
                                                <ProfileStat title="Overall" type="overall" data={profile} />
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
                                    <RecordDeltaChart
                                        data={profile.entries}
                                        mode={1}
                                        title="Single Player"
                                        color="#2E93fA"
                                    />
                                </Paper>
                                <Paper style={{ paddingTop: '10px', marginBottom: '25px' }}>
                                    <RecordDeltaChart
                                        data={profile.entries}
                                        mode={2}
                                        title="Cooperative"
                                        color="#FF9800"
                                    />
                                </Paper>

                                <div style={{ paddingTop: '10px', marginBottom: '20px' }}>
                                    Share:{' '}
                                    <Link href={`http://lp.nekz.me/@/${profile._id}`}>lp.nekz.me/@/{profile._id}</Link>
                                </div>
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
