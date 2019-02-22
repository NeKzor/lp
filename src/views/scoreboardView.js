import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ScoresTable from '../components/scoresTable';

class ScoreboardView extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        dialogOpener: PropTypes.func.isRequired,
    };

    render() {
        const { data, dialogOpener } = this.props;

        return (
            <>
                <Grid container>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        <ScoresTable data={data} handleClickOpen={dialogOpener} />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default ScoreboardView;
