import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    help: {
        cursor: 'help',
    },
    aboutBox: {
        padding: theme.spacing.unit * 3,
    },
});

class AboutView extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.description = [
            'This leaderboard includes all legit players who care about least portal records in Portal 2.',
            '',
            'Ranking Requirements:',
            '- Be in top 5000 on every single player or cooperative leaderboard.',
            '- Tie as many records as possible or get at least very close to it.',
            '- Do not cheat.'
        ];
        this.tooltip = 'Automatic ban system catches users who cheated at least once.';
    }

    render() {
        const { classes, data } = this.props;

        const description = this.description.map((text, idx) => (
            <ListItem key={idx}>
                <Typography variant="body1">
                    {text}
                </Typography>
            </ListItem>
        ));

        const openSourceLink = <Link rel="noopener" href="https://github.com/NeKzor/lp">GitHub</Link>;

        const detectedCheaters = (
            <Tooltip
                placement="right"
                title={this.tooltip}
                disableFocusListener
                disableTouchListener
            >
                <Link className={classes.help}>{data.cheaters.length}</Link>
            </Tooltip>
        );

        return (
            <>
                <Grid container>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        <Paper className={classes.aboutBox}>
                            <List className={classes.list} dense>
                                <ListItem><Typography component="h2" variant="h5">Who's the lp king?</Typography></ListItem>
                                {description}
                                <ListItem></ListItem>
                                <ListItem><Typography variant="subtitle1">Project is open source at {openSourceLink}.</Typography></ListItem>
                                <ListItem><Typography variant="subtitle1">Number of detected cheaters: {detectedCheaters}</Typography></ListItem>
                                <ListItem><Typography variant="subtitle1">Last Update: {data.export_date}</Typography></ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(AboutView);
