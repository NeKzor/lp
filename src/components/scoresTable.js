import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import { Link } from '@material-ui/core';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'rank', numeric: true, sortable: false, disablePadding: false, label: 'Rank' },
    { id: 'name', numeric: false, sortable: false, disablePadding: false, label: 'Player' },
    { id: 'score', numeric: true, sortable: true, disablePadding: false, label: 'Portals' },
];

class ScoresTableHead extends React.Component {
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

ScoresTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const styles = theme => ({
    root: {
        
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        //minWidth: 100,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    imageCell: {
        display: 'flex',
        alignItems: 'center'
    },
    clickLink: {
        cursor: 'pointer'
    },
});

class ScoresTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'score',
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

    render() {
        const { classes, data, handleClickOpen } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;

        return (
            <React.Fragment>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <ScoresTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(item => {
                                        let profile = item.getProfile();
                                        let stats = item.getStats();
                                        return (
                                            <TableRow hover tabIndex={-1} key={item.id}>
                                                <TableCell align="center">{item.rank}</TableCell>
                                                <TableCell align="center" className={classes.imageCell}>
                                                    <Avatar className={classes.avatar} src={profile && profile.avatar_link} />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Link className={classes.clickLink} onClick={() => handleClickOpen(item.id)} color="inherit">
                                                        {(profile && profile.profile_name) || item.id}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip
                                                        placement="top"
                                                        title={`${stats.percentage}% (${item.score + stats.delta}+${stats.delta})`}
                                                        disableFocusListener
                                                        disableTouchListener
                                                    >
                                                        <div>{item.score}</div>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
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
                </Paper>
            </React.Fragment>
        );
    }
}

ScoresTable.propTypes = {
    classes: PropTypes.object.isRequired,
    handleClickOpen: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ScoresTable);
