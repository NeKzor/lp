import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
    gridView: {
        marginTop: theme.spacing.unit * 3,
    },
    flex: {
        flex: 1,
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
        profileId: PropTypes.string.isRequired,
    };

    gotoSteamProfile = (id) => {
        let tab = window.open(`https://steamcommunity.com/profiles/${id}`, '_blank');
        tab.opener = null;
    };

    render() {
        const { classes, dialogOpen, handleClose, data, profileId } = this.props;

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
                                <Button color="inherit" onClick={() => this.gotoSteamProfile(profileId)}>
                                    <Avatar src={data.profile.avatar} />
                                </Button>
                            </Tooltip>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                &nbsp;&nbsp;&nbsp;{data.profile.name}
                            </Typography>
                            <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Grid container className={classes.gridView}>
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
