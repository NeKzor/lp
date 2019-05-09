import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import ProfileTable from './profileTable';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    stats: {
        marginTop: theme.spacing.unit * 3,
    },
    records: {
        marginTop: theme.spacing.unit * 3,
    },
    flex: {
        flex: 1,
    },
    paper: {
        padding: theme.spacing.unit * 5,
        textAlign: 'center',
    },
});

const Transition = (props) => {
    return <Slide direction="up" {...props} />;
}

class ProfileDialog extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        dialogOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
    };

    gotoSteamProfile = (id) => {
        let tab = window.open(`https://steamcommunity.com/profiles/${id}`, '_blank');
        tab.opener = null;
    };

    render() {
        const { classes, dialogOpen, handleClose, data } = this.props;

        return (
            <>
                <Dialog
                    fullScreen
                    open={dialogOpen}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar position="sticky">
                        <Toolbar>
                            <Tooltip placement="bottom" title="Open Steam profile" disableFocusListener disableTouchListener>
                                <Button color="inherit" onClick={() => this.gotoSteamProfile(data.id)}>
                                    <Avatar src={data.avatar} />
                                </Button>
                            </Tooltip>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                &nbsp;&nbsp;&nbsp;{data.name}
                            </Typography>
                            <Tooltip placement="bottom" title="Close profile" disableFocusListener disableTouchListener>
                                <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    {data.entries.length === 0 && <LinearProgress />}
                    <Grid container className={classes.stats}>
                        <Grid item xs={false} md={1} lg={3} />
                        <Grid item xs={12} md={10} lg={6}>
                            {data.entries.length !== 0
                                && <Grid container spacing={24}>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Paper className={classes.paper}>
                                            <Tooltip placement="top" title={data.sp.score !== 0 ? `${data.sp.score - data.sp.delta}+${data.sp.delta}` : ''} disableFocusListener disableTouchListener>
                                                <Typography variant="h3" gutterBottom>{(data.sp.percentage !== 0) ? data.sp.percentage : 0}%</Typography>
                                            </Tooltip>
                                            <Typography variant="subtitle1" gutterBottom>Single Player</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Paper className={classes.paper}>
                                            <Tooltip placement="top" title={data.coop.score !== 0 ? `${data.coop.score - data.coop.delta}+${data.coop.delta}` : ''} disableFocusListener disableTouchListener>
                                                <Typography variant="h3" gutterBottom>{(data.coop.percentage !== 0) ? data.coop.percentage : 0}%</Typography>
                                            </Tooltip>
                                            <Typography variant="subtitle1" gutterBottom>Cooperative</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Paper className={classes.paper}>
                                            <Tooltip placement="top" title={data.overall.percentage !== 0 ? `${data.overall.score - data.overall.delta}+${data.overall.delta}` : ''} disableFocusListener disableTouchListener>
                                                <Typography variant="h3" gutterBottom>{(data.overall.percentage !== 0) ? data.overall.percentage : 0}%</Typography>
                                            </Tooltip>
                                            <Typography variant="subtitle1" gutterBottom>Overall</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>}
                        </Grid>
                    </Grid>
                    <Grid container className={classes.records}>
                        <Grid item xs={false} md={1} lg={3} />
                        <Grid item xs={12} md={10} lg={6}>
                            <Paper>
                                <ProfileTable data={data.entries} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileDialog);
