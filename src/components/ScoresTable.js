import React from 'react';
import { library as fa } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
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

fa.add(faMedal);

const rows = [
    { id: 'rank', numeric: true, sortable: false, label: 'Rank' },
    { id: 'name', numeric: false, sortable: false, label: 'Player' },
    { id: 'score', numeric: true, sortable: true, label: 'Portals' },
];

const ScoresTableHead = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {rows.map((row) => (
                    <TableCell key={row.id} align={row.numeric ? 'center' : 'left'} sortDirection={orderBy === row.id ? order : false}>
                        {row.sortable === true && (
                            <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                                <TableSortLabel active={orderBy === row.id} direction={order} onClick={createSortHandler(row.id)}>
                                    {row.label}
                                </TableSortLabel>
                            </Tooltip>
                        )}
                        {row.sortable === false && row.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const useStyles = makeStyles(() => ({
    root: {
        overflowX: 'auto',
    },
    playerCell: {
        display: 'flex',
        alignItems: 'center',
    },
    clickLink: {
        cursor: 'pointer',
    },
}));

const ScoresTable = (data, handleClickOpen) => {
    const [state, setState] = React.useState({
        order: 'asc',
        orderBy: 'score',
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

    const classes = useStyles();
    const { order, orderBy, rowsPerPage, page } = state;

    return (
        <div className={classes.root}>
            <Table>
                <ScoresTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={data.length} />
                <TableBody>
                    {stableSort(data, order, orderBy)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item) => {
                            let profile = item.getProfile();
                            let stats = item.getStats();
                            return (
                                <TableRow hover tabIndex={-1} key={item.id}>
                                    <TableCell align="center">
                                        {item.rank === 1 ? (
                                            <FontAwesomeIcon title="Rank 1" icon="medal" color="#ffd700" />
                                        ) : item.rank === 2 ? (
                                            <FontAwesomeIcon title="Rank 2" icon="medal" color="#C0C0C0" />
                                        ) : item.rank === 3 ? (
                                            <FontAwesomeIcon title="Rank 3" icon="medal" color="#cd7f32" />
                                        ) : (
                                            item.rank
                                        )}
                                    </TableCell>
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
                                            title={`${stats.percentage}% (${item.score - stats.delta}+${stats.delta})`}
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

export default ScoresTable;
