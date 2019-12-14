import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import RecordsTable from '../components/RecordsTable';
import RecordChart from '../components/RecordChart';
import AppState from '../AppState';

const useStyles = makeStyles((theme) => ({
    searchBox: {
        padding: 10,
        marginBottom: theme.spacing(3),
    },
}));

const RecordsView = () => {
    const {
        state: { records },
    } = React.useContext(AppState);

    const [searchTerm, setSearchTerm] = React.useState('');

    const filterRecords = (records) => {
        return records.filter((x) => {
            return searchTerm.length === 0 || x.name.toUpperCase().startsWith(searchTerm.toUpperCase()) || x.wr === parseInt(searchTerm);
        });
    };

    const handleInputChange = (ev) => {
        setSearchTerm(ev.target.value);
    };

    const classes = useStyles();

    return (
        <>
            <Grid container>
                <Grid item xs={false} md={1} lg={3} />
                <Grid item xs={12} md={10} lg={6}>
                    <Paper style={{ marginBottom: '50px' }}>
                        <RecordChart data={records} mode={1} title="Single Player" color="#2E93fA" />
                    </Paper>
                    <Paper style={{marginBottom: '50px' }}>
                        <RecordChart data={records} mode={2} title="Cooperative" color="#FF9800" />
                    </Paper>
                    <Paper className={classes.searchBox}>
                        <FormGroup>
                            <Input placeholder="Search" onChange={handleInputChange} disableUnderline={true} />
                        </FormGroup>
                    </Paper>
                    <Paper>
                        <RecordsTable data={filterRecords(records)} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default RecordsView;
