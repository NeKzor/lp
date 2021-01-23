import React from 'react';
import MaterialAppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SiteTabs from './Tabs';
import Fade from '@material-ui/core/Fade';
import ProfileButton from './ProfileButton';
import AppState from '../AppState';
import { api2 } from '../Api';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(14),
    },
    flex: {
        flex: 1,
    },
}));

type AppBarProps = {
    currentTab: number;
};

const AppBar = ({ currentTab }: AppBarProps) => {
    const {
        state: { user },
        dispatch,
    } = React.useContext(AppState);

    const classes = useStyles();

    React.useEffect(() => {
        api2.getMe()
            .then((data: any) => dispatch({ action: 'setProfile', data }));
    }, []);

    return (
        <div className={classes.root}>
            <MaterialAppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        <Link href="/" color="inherit" style={{ textDecoration: 'none' }}>
                            Least Portals
                        </Link>
                    </Typography>
                    <div className={classes.flex} />
                    <Fade in={true} timeout={1000}>
                        <ProfileButton data={user} />
                    </Fade>
                </Toolbar>
                <SiteTabs currentTab={currentTab} />
            </MaterialAppBar>
        </div>
    );
};

export default AppBar;
