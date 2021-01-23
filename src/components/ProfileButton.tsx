import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { PopoverOrigin } from '@material-ui/core/Popover';

const useStyles = makeStyles((_) => ({
    root: {
        paddingRight: '10px',
    },
    avatar: {
        width: '35px',
        height: '35px',
    },
}));

const anchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
};
const transformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center',
};

type ProfileButtonProps = {
    data: any;
};

const ProfileButton = ({ data }: ProfileButtonProps) => {
    const [anchor, setAnchor] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!data.isLoggedIn()) {
            window.open('https://localhost:8080/login', '_self');
        } else {
            setAnchor(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchor(null);
    };

    const logout = () => {
        window.open('/logout', '_self');
    };

    const classes = useStyles();
    const open = Boolean(anchor);

    return (
        <div className={classes.root}>
            <Tooltip
                placement="bottom"
                title={data.isLoggedIn() ? 'Logged in as ' + data.profile.name : 'Log in with Steam'}
                disableFocusListener
            >
                <IconButton color="inherit" size="small" onClick={handleOpen}>
                    {data.isLoggedIn() ? (
                        <Avatar src={data.profile.avatar_url} className={classes.avatar} alt="avatar_image" />
                    ) : (
                        <AccountCircle />
                    )}
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                elevation={0}
                getContentAnchorEl={null}
                anchorEl={anchor}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} component={RouterLink} to="me">
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose} component={RouterLink} to="settings">
                    Settings
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

export default ProfileButton;
