import React from 'react';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppState from '../AppState';
import { useIsMounted } from '../Hooks';

const useStyles = makeStyles((theme) => ({
    help: {
        cursor: 'help',
    },
    aboutBox: {
        padding: theme.spacing(3),
    },
}));

const branches = [
    { repo: 'NeKzor/lp', branch: 'master' },
    { repo: 'NeKzBot/lp', branch: 'api' },
    { repo: 'NeKzor/lp', branch: 'gh-pages' },
];

const noWrap = { whiteSpace: 'nowrap' };
const MinTableCell = (props) => <TableCell size="small" {...props} />;
const Padding = () => <div style={{ paddingTop: '50px' }} />;

const AboutView = () => {
    const isMounted = useIsMounted();

    const {
        state: { cheaters, darkMode },
        dispatch,
    } = React.useContext(AppState);

    const [gitHub, setGitHub] = React.useState([]);
    const classes = useStyles();

    React.useEffect(() => {
        const anyErrors = (err) => {
            console.error(err);
            if (isMounted.current) {
                setGitHub(undefined);
            }
        };

        Promise.all(branches.map(({ repo, branch }) => fetch(`https://api.github.com/repos/${repo}/commits/${branch}`)))
            .then((results) => {
                Promise.all(results.map((res) => res.json()))
                    .then((branches) => {
                        if (isMounted.current) {
                            setGitHub(
                                branches.map((branch) => ({
                                    sha: branch.sha,
                                    author: branch.author ? branch.author : branch.commit.author,
                                    message: branch.commit.message,
                                    date: branch.commit.author.date,
                                })),
                            );
                        }
                    })
                    .catch(anyErrors);
            })
            .catch(anyErrors);
    }, [isMounted]);

    const toggleDarkMode = () => {
        dispatch({ action: 'toggleDarkMode' });
    };

    const detectedCheaters = (
        <Tooltip
            placement="right"
            title="Automatic ban system catches users who cheated at least once."
            disableFocusListener
            disableTouchListener
        >
            <Link className={classes.help}>{cheaters.length}</Link>
        </Tooltip>
    );

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
                        <Typography variant="body1">- Be in top 5000 on every single player or cooperative leaderboard.</Typography>
                        <Typography variant="body1">- Tie as many records as possible or get at least very close to it.</Typography>
                        <Typography variant="body1">- Don't be one of the {detectedCheaters} cheaters.</Typography>

                        <Padding />

                        <Typography variant="h5">Last Update</Typography>
                        <br />
                        {gitHub === undefined ? (
                            <Typography variant="body1">Unable to fetch status from GitHub.</Typography>
                        ) : gitHub.length === 0 ? (
                            <CircularProgress className={classes.progress} />
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="default">
                                                <Typography variant="body1">Branch</Typography>
                                            </TableCell>
                                            <TableCell padding="default">
                                                <Typography variant="body1">Date</Typography>
                                            </TableCell>
                                            <TableCell padding="default">
                                                <Typography variant="body1">Author</Typography>
                                            </TableCell>
                                            <TableCell padding="default">
                                                <Typography variant="body1">Commit</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {gitHub.map((commit, idx) => {
                                            const { repo, branch } = branches[idx];
                                            return (
                                                <TableRow tabIndex={-1} key={idx} style={noWrap}>
                                                    <MinTableCell align="left">
                                                        <Link
                                                            color="inherit"
                                                            rel="noopener"
                                                            href={`https://github.com/${repo}/tree/${branch}`}
                                                        >
                                                            {branch}
                                                        </Link>
                                                    </MinTableCell>
                                                    <MinTableCell align="left" style={noWrap}>
                                                        <Tooltip title={moment(commit.date).toString()}>
                                                            <span>{moment(commit.date).from()}</span>
                                                        </Tooltip>
                                                    </MinTableCell>
                                                    <MinTableCell align="left">
                                                        {commit.author.html_url ? (
                                                            <Link color="inherit" rel="noopener" href={commit.author.html_url}>
                                                                {commit.author.login}
                                                            </Link>
                                                        ) : (
                                                            commit.author.name || 'n/a'
                                                        )}
                                                    </MinTableCell>
                                                    <MinTableCell align="left" style={noWrap}>
                                                        <Tooltip title={commit.message}>
                                                            <Link
                                                                color="inherit"
                                                                rel="noopener"
                                                                href={'https://github.com/NeKzor/lp/commit/' + commit.sha}
                                                            >
                                                                {commit.sha}
                                                            </Link>
                                                        </Tooltip>
                                                    </MinTableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        <Padding />

                        <Typography variant="h5">Theme Settings</Typography>
                        <br />
                        <FormGroup row>
                            <FormControlLabel
                                control={<Switch checked={darkMode.enabled} onChange={toggleDarkMode} color="primary" />}
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
