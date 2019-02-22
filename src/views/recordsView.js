import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import RecordsTable from '../components/recordsTable';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    searchBox: {
        padding: 10,
        marginBottom: theme.spacing.unit * 3,
    },
});

class RecordsView extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
    };

    state = {
        searchTerm: '',
    };

    filterRecords(records) {
        return records.filter(x => {
            return this.state.searchTerm.length === 0
                || (x.name.toUpperCase().startsWith(this.state.searchTerm.toUpperCase()) || x.wr === parseInt(this.state.searchTerm));
        });
    }

    setSearchTerm = (ev) => {
        this.setState({ searchTerm: ev.target.value })
    }

    render() {
        const { classes, data } = this.props;

        return (
            <>
                <Grid container>
                    <Grid item xs={false} md={1} lg={3} />
                    <Grid item xs={12} md={10} lg={6}>
                        <Paper className={classes.searchBox}>
                            <FormGroup>
                                <Input
                                    placeholder="Search"
                                    inputProps={{ 'aria-label': 'Description' }}
                                    onChange={this.setSearchTerm}
                                    disableUnderline={true}
                                />
                            </FormGroup>
                        </Paper>
                        <RecordsTable data={this.filterRecords(data)} />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(RecordsView);
