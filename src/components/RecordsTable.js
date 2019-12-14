import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import stableSort from '../utils/stableSort';

const rows = [
    { id: 'name', numeric: false, sortable: true, label: 'Map' },
    { id: 'wr', numeric: true, sortable: true, label: 'Portals' },
    { id: 'ties', numeric: true, sortable: true, label: 'Ties' },
    { id: 'video', numeric: true, sortable: false, label: 'Video' },
];

const RecordsTableHead = ({ order, orderBy, onRequestSort}) => {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {rows.map(
                    (row) => (
                        <TableCell
                            key={row.id}
                            align={row.numeric ? 'center' : 'left'}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.id ? order : false}
                        >
                            {row.sortable === true && (
                                <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                                    <TableSortLabel active={orderBy === row.id} direction={order} onClick={createSortHandler(row.id)}>
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            )}
                            {row.sortable === false && row.label}
                        </TableCell>
                    ),
                    this,
                )}
            </TableRow>
        </TableHead>
    );
};

const useStyles = makeStyles(() => ({
    root: {
        overflowX: 'auto',
    },
    helpLink: {
        cursor: 'help',
    },
}));

const RecordsTable = ({ data }) => {
    const [state, setState] = React.useState({
        order: 'asc',
        orderBy: 'index',
        page: 0,
        rowsPerPage: 50,
    });

    const handleRequestSort = (_, property) => {
        const orderBy = property;
        let order = 'desc';

        if (state.orderBy === property && state.order === 'desc') {
            order = 'asc';
        }

        setState({ order, orderBy });
    };

    const handleChangePage = (_, page) => {
        setState({ page });
    };

    const handleChangeRowsPerPage = (ev) => {
        setState({ rowsPerPage: ev.target.value });
    };

    const gotoYouTube = (record) => () => {
        let query = `Portal+2+${record.name.replace(/ /g, '+')}+in+${record.wr}+Portals`;
        let tab = window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        tab.opener = null;
    };

    const classes = useStyles();
    const { order, orderBy, rowsPerPage, page } = state;

    const ExcludedMapsInfo = () => (
        <Tooltip placement="right" title="Disabled tracking records for this map." disableFocusListener disableTouchListener>
            <Link className={classes.helpLink}>n/a</Link>
        </Tooltip>
    );

    return (
        <div className={classes.root}>
            <Table aria-labelledby="tableTitle">
                <RecordsTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={data.length} />
                <TableBody>
                    {stableSort(data, order, orderBy)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((record) => {
                            return (
                                <TableRow hover tabIndex={-1} key={record.id}>
                                    <TableCell>
                                        <Link
                                            target="_blank"
                                            rel="noopener"
                                            color="inherit"
                                            href={`https://steamcommunity.com/stats/Portal2/leaderboards/${record.id}`}
                                        >
                                            {record.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">{record.wr}</TableCell>
                                    <TableCell align="center">{record.excluded === true ? <ExcludedMapsInfo /> : record.ties}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip
                                            placement="right"
                                            title="Search record on YouTube"
                                            disableFocusListener
                                            disableTouchListener
                                        >
                                            <IconButton color="primary" onClick={gotoYouTube(record)}>
                                                <PlayArrow />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelDisplayedRows={() => ''}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default RecordsTable;
