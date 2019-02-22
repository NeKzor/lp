import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import stableSort from '../utils/stableSort';

const rows = [
    { id: 'name', numeric: false, sortable: true, label: 'Map' },
    { id: 'score', numeric: true, sortable: true, label: 'Portals' },
    { id: 'wrDelta', numeric: true, sortable: true, label: 'ΔWR' },
];

class ProfileTableHead extends React.Component {
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
                                align={row.numeric ? 'center' : 'center'}
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

class ProfileTable extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    state = {
        order: 'asc',
        orderBy: 'name',
        page: 0,
        rowsPerPage: 100,
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

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render() {
        const { data } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;

        return (
            <>
                <Table aria-labelledby="tableTitle">
                    <ProfileTableHead
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
                                        <TableCell align="center">
                                            <Link
                                                target="_blank"
                                                rel="noopener"
                                                color="inherit"
                                                href={`https://steamcommunity.com/stats/Portal2/leaderboards/${record.id}`}
                                            >
                                                {record.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">{record.score}</TableCell>
                                        <TableCell align="center">
                                            {(record.wrDelta !== null)
                                                ? (record.wrDelta === 0)
                                                    ? '-'
                                                    : `+${record.wrDelta}`
                                                : 'n/a'}
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
            </>
        );
    }
}

export default ProfileTable;
