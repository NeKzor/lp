import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
    },
    media: {
        height: 190,
    },
}));

const watch = (id) => () => {
    const tab = window.open(`https://youtu.be/${id}`, '_blank');
    tab.opener = null;
};

const Showcase = ({ data }) => {
    const classes = useStyles();

    const avatar = (
        <Avatar alt={data.player.name} src={data.player.avatar}>
            {!data.player.avatar ? data.player.name[0] : undefined}
        </Avatar>
    );

    return (
        <Card className={classes.card}>
            <CardHeader avatar={avatar} title={data.player.name} subheader={data.date} />
            <Tooltip
                title="Watch on YouTube"
                onClick={watch(data.media)}
                style={{ cursor: 'pointer' }}
                placement="top"
                enterDelay={1000}
                disableFocusListener
                disableTouchListener
            >
                <CardMedia
                    className={classes.media}
                    image={`https://i.ytimg.com/vi/${data.media.split('?')[0]}/sddefault.jpg`}
                />
            </Tooltip>
        </Card>
    );
};

export default Showcase;
