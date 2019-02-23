import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { Link } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
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
    { id: 'rank', numeric: true, sortable: false, label: 'Rank' },
    { id: 'name', numeric: false, sortable: false, label: 'Player' },
    { id: 'score', numeric: true, sortable: true, label: 'Portals' },
];

class ScoresTableHead extends React.Component {
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
                        )
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

const styles = _ => ({
    playerCell: {
        display: 'flex',
        alignItems: 'center',
    },
    clickLink: {
        cursor: 'pointer',
    },
});

class ScoresTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleClickOpen: PropTypes.func.isRequired,
        data: PropTypes.array.isRequired,
    };

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
            <Paper>
                <Table>
                    <ScoresTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={this.handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {stableSort(data, order, orderBy)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(item => {
                                let profile = item.getProfile();
                                let stats = item.getStats();
                                return (
                                    <TableRow hover tabIndex={-1} key={item.id}>
                                        <TableCell align="center">{item.rank}</TableCell>
                                        <TableCell>
                                            <div className={classes.playerCell}>
                                            <Avatar src={profile && profile.avatar_link} />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <Link className={classes.clickLink} onClick={() => handleClickOpen(item.id)} color="inherit">
                                                {(profile && profile.profile_name) || item.id}
                                            </Link>
                                            </div>
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
        );
    }
}

export default withStyles(styles)(ScoresTable);
