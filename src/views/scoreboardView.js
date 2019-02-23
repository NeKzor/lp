import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ScoresTable from '../components/scoresTable';
import { withContext } from '../withContext';

class ScoreboardView extends React.Component {
    static propTypes = {
        downloadBoard: PropTypes.func.isRequired,
        data: PropTypes.array.isRequired,
        boardType: PropTypes.string.isRequired,
        dialogOpener: PropTypes.func.isRequired,
    };

    async componentDidMount() {
        if (this.props.data.length === 0) {
            await this.props.downloadBoard(this.props.boardType);
        }
    }

    render() {
        const { data, dialogOpener } = this.props;

        return (
            <>
                <Grid container>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        <Paper>
                            {data.length === 0 && <LinearProgress />}
                            <ScoresTable data={data} handleClickOpen={dialogOpener} />
                        </Paper>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default withContext(ScoreboardView);
