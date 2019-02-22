import React from 'react';
import PropTypes from 'prop-types';
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
import { withStyles } from '@material-ui/core/styles';
import SiteTabs from '../components/tabs';

const styles = theme => ({
    root: {
        paddingBottom: theme.spacing.unit * 14,
    },
    list: {
        width: theme.spacing.unit * 25,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class AppBarWithDrawer extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        currentTab: PropTypes.number.isRequired,
        onTabChange: PropTypes.func.isRequired,
    };

    constructor() {
        super();

        this.homepage = 'https://nekzor.github.io/';
        this.pageLinks = [
            { text: 'Glitches', link: 'glitches.html' },
            { text: 'Least Portals', link: 'lp.html' },
            { text: 'Demo Parser', link: 'parser.html' }
        ];
    }

    state = {
        open: false,
    };

    showDrawer = (state) => () => {
        this.setState({ open: state });
    }

    gotoPage = (page) => () => {
        window.open(this.homepage + page, '_self');
    }

    render() {
        const { classes, currentTab, onTabChange } = this.props;

        const list = (
            <div className={classes.list}>
                <List>
                    <ListItem button key={0} onClick={this.gotoPage(this.homepage + 'index.html')}>
                        <ListItemText primary={'nekzor.github.io'} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {this.pageLinks.map((item, index) => (
                        <ListItem button key={index} onClick={this.gotoPage(`${item.link}`)}>
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
                        <IconButton onClick={this.showDrawer(true)} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">Least Portals</Typography>
                    </Toolbar>
                    <SiteTabs currentTab={currentTab} handleTabChange={onTabChange} />
                </AppBar>
                <SwipeableDrawer open={this.state.open} onClose={this.showDrawer(false)} onOpen={this.showDrawer(true)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.showDrawer(false)}
                        onKeyDown={this.showDrawer(false)}
                    >
                        {list}
                    </div>
                </SwipeableDrawer>
            </div>
        )
    };
}

export default withStyles(styles)(AppBarWithDrawer);
