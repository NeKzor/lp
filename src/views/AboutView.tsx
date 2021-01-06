import React from 'react';
import moment from 'moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppState from '../AppState';

const useStyles = makeStyles((theme) => ({
    help: {
        cursor: 'help',
    },
    aboutBox: {
        padding: theme.spacing(3),
    },
}));

const Padding = () => <div style={{ paddingTop: '50px' }} />;

const getUpdate = () => {
    // Not sure if this is right lol
    const now = moment.utc();
    let updateIn = moment().utc().endOf('day').add(30, 'minutes');

    if (updateIn.isBefore(now)) {
        updateIn = moment().utc().endOf('day').add(1, 'day').add(30, 'minutes');
    }

    const duration = moment.duration({ from: now, to: updateIn });
    const hours = duration.get('hours');
    const minutes = duration.get('minutes');
    const seconds = duration.get('seconds');

    const g = (value: number) => (value === 1 ? '' : 's');
    return `${hours} hour${g(hours)}, ${minutes} minute${g(minutes)}, ${seconds} second${g(seconds)}`;
};

let clockTimer: number | undefined = undefined;

const AboutView = () => {
    const {
        state: { darkMode },
        dispatch,
    } = React.useContext(AppState);

    const [nextUpdate, setNextUpdate] = React.useState(getUpdate());
    const classes = useStyles();

    React.useEffect(() => {
        clockTimer = window.setInterval(() => {
            setNextUpdate(getUpdate());
        }, 1000);

        return () => window.clearInterval(clockTimer);
    }, []);

    const toggleDarkMode = () => {
        dispatch({ action: 'toggleDarkMode' });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={false} md={1} lg={3} />
                <Grid item xs={12} md={10} lg={6}>
                    <Paper className={classes.aboutBox}>
                        <Typography component="h2" variant="h3">
                            Who's the lp king?
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            This leaderboard includes all legit players who care about least portal records in Portal 2.
                        </Typography>

                        <Padding />

                        <Typography component="h2" variant="h5">
                            Ranking Requirements
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            - Be in top 5000 on every single player or cooperative leaderboard.
                        </Typography>
                        <Typography variant="body1">
                            - A world record tie is required in case a map has more than 5000 ties.
                        </Typography>
                        <Typography variant="body1">
                            - Do not cheat and follow the{' '}
                            <Link rel="noopener" href="http://lp.nekz.me/rules">
                                rules
                            </Link>
                            .
                        </Typography>

                        <Padding />

                        <Typography variant="h5">Next Update</Typography>
                        <br />
                        {nextUpdate}

                        <Padding />

                        <Typography variant="h5">Theme Settings</Typography>
                        <br />
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch checked={darkMode.enabled} onChange={toggleDarkMode} color="primary" />
                                }
                                label="Dark Mode"
                            />
                        </FormGroup>

                        <Padding />

                        <Tooltip title="Source Code">
                            <Link rel="noopener" href="https://github.com/NeKzor/lp">
                                github.com/NeKzor/lp
                            </Link>
                        </Tooltip>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default AboutView;
