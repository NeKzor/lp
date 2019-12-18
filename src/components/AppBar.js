import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SiteTabs from './Tabs';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(14),
    },
    list: {
        width: theme.spacing(25),
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}));

const pageLinks = [
    { text: 'Glitches', link: 'glitches.html' },
    { text: 'Least Portals', link: 'lp' },
    { text: 'Demo Parser', link: 'parser.html' },
    { text: 'Cvars', link: 'cvars' },
];
const homepage = 'https://nekzor.github.io/';

const gotoPage = (page) => () => {
    window.open(homepage + page, '_self');
};

const AppBarWithDrawer = ({ currentTab, onTabChange }) => {
    const [open, setOpen] = React.useState(false);

    const showDrawer = (state) => () => {
        setOpen(state);
    };

    const classes = useStyles();

    const list = (
        <div className={classes.list}>
            <List>
                <ListItem button key={0} onClick={gotoPage('index.html')}>
                    <ListItemText primary={'nekzor.github.io'} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {pageLinks.map((item, index) => (
                    <ListItem button key={index} onClick={gotoPage(`${item.link}`)}>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton onClick={showDrawer(true)} className={classes.menuButton} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        Least Portals
                    </Typography>
                </Toolbar>
                <SiteTabs currentTab={currentTab} handleTabChange={onTabChange} />
            </AppBar>
            <SwipeableDrawer open={open} onClose={showDrawer(false)} onOpen={showDrawer(true)}>
                <div tabIndex={0} role="button" onClick={showDrawer(false)} onKeyDown={showDrawer(false)}>
                    {list}
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export default AppBarWithDrawer;
