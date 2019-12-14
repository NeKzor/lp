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
    let tab = window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
    tab.opener = null;
};

const Showcase = ({ data }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={<Avatar alt={data.player.name} src={data.player.avatar} />}
                title={data.player.name}
                subheader={data.date}
            />
            <Tooltip
                title="Watch on YouTube"
                onClick={watch(data.media)}
                style={{ cursor: 'pointer' }}
                placement="top"
                enterDelay={1000}
                disableFocusListener
                disableTouchListener
            >
                <CardMedia className={classes.media} image={`https://i.ytimg.com/vi/${data.media}/maxresdefault.jpg`} />
            </Tooltip>
        </Card>
    );
};

export default Showcase;
