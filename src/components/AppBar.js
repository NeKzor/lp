import React from 'react';
import MaterialAppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SiteTabs from './Tabs';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(14),
    },
}));

const AppBar = ({ currentTab }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MaterialAppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        <Link href="/" color="inherit" style={{ textDecoration: 'none' }}>
                            Least Portals
                        </Link>
                    </Typography>
                </Toolbar>
                <SiteTabs currentTab={currentTab} />
            </MaterialAppBar>
        </div>
    );
};

export default AppBar;
