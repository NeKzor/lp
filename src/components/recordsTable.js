import React from 'react';
import PropTypes from 'prop-types';
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
import { withStyles } from '@material-ui/core/styles';
import stableSort from '../utils/stableSort';

const rows = [
    { id: 'name', numeric: false, sortable: true, label: 'Map' },
    { id: 'wr', numeric: true, sortable: true, label: 'Portals' },
    { id: 'ties', numeric: true, sortable: true, label: 'Ties' },
    { id: 'video', numeric: true, sortable: false, label: 'Video' },
];

class RecordsTableHead extends React.Component {
    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'center' : 'left'}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                {row.sortable === true &&
                                    <Tooltip
                                        title="Sort"
                                        placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === row.id}
                                            direction={order}
                                            onClick={this.createSortHandler(row.id)}
                                        >
                                            {row.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                }
                                {row.sortable === false && row.label}
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

const styles = _ => ({
    root: {
        overflowX: 'auto',
    },
    helpLink: {
        cursor: 'help'
    },
});

class RecordsTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
    };

    state = {
        order: 'asc',
        orderBy: 'index',
        page: 0,
        rowsPerPage: 10,
    };

    handleRequestSort = (_, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleChangePage = (_, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (ev) => {
        this.setState({ rowsPerPage: ev.target.value });
    };

    gotoYouTube = (record) => () => {
        let query = `Portal+2+${record.name.replace(/ /g, '+')}+in+${record.wr}+Portals`;
        let tab = window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        tab.opener = null;
    };

    render() {
        const { classes, data } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;

        const ExcludedMapsInfo = () => (
            <Tooltip
                placement="right"
                title="Disabled tracking records for this map."
                disableFocusListener
                disableTouchListener
            >
                <Link className={classes.helpLink}>n/a</Link>
            </Tooltip>
        );

        return (
            <div className={classes.root}>
                <Table aria-labelledby="tableTitle">
                    <RecordsTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={this.handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {stableSort(data, order, orderBy)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(record => {
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
                                        <TableCell align="center">
                                            {(record.excluded === true)
                                                ? <ExcludedMapsInfo />
                                                : record.ties
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip placement="right" title="Search record on YouTube" disableFocusListener disableTouchListener>
                                                <IconButton color="primary" onClick={this.gotoYouTube(record)}>
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
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
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
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        );
    }
}

export default withStyles(styles)(RecordsTable);
