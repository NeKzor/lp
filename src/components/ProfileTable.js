import React from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import stableSort from '../utils/stableSort';

const rows = [
    { id: 'index', numeric: false, sortable: true, label: 'Map' },
    { id: 'score', numeric: true, sortable: true, label: 'Portals' },
    { id: 'delta', numeric: true, sortable: true, label: 'ΔWR' },
];

const ProfileTableHead = ({ order, orderBy, onRequestSort }) => {
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
                            align={row.numeric ? 'center' : 'center'}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.id ? order : false}
                        >
                            {row.sortable === true && (
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={createSortHandler(row.id)}
                                    >
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
}));

const ProfileTable = ({ data }) => {
    const [state, setState] = React.useState({
        order: 'asc',
        orderBy: 'index',
    });

    const handleRequestSort = (_, property) => {
        const orderBy = property;
        let order = 'desc';

        if (state.orderBy === property && state.order === 'desc') {
            order = 'asc';
        }

        setState({ order, orderBy });
    };

    const classes = useStyles();
    const { order, orderBy } = state;

    const UnknownScoreInfo = () => (
        <Tooltip placement="right" title="Unknown score." disableFocusListener disableTouchListener>
            <Link style={{ cursor: 'help' }}>n/a</Link>
        </Tooltip>
    );

    return (
        <div className={classes.root}>
            <Table>
                <ProfileTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={data.length}
                />
                <TableBody>
                    {stableSort(data, order, orderBy).map((record) => {
                        const score =
                            record.score !== undefined ? (
                                record.showcase ? (
                                    <Tooltip
                                        placement="right"
                                        title="Watch on YouTube"
                                        disableFocusListener
                                        disableTouchListener
                                    >
                                        <Link
                                            target="_blank"
                                            rel="noopener"
                                            href={`https://youtu.be/${record.showcase.media}`}
                                        >
                                            <b>{record.score}</b>
                                        </Link>
                                    </Tooltip>
                                ) : (
                                    record.score
                                )
                            ) : (
                                <UnknownScoreInfo />
                            );
                        const delta =
                            record.score !== undefined ? (
                                record.delta === 0 ? (
                                    ''
                                ) : (
                                    `+${record.delta}`
                                )
                            ) : (
                                <UnknownScoreInfo />
                            );

                        return (
                            <TableRow hover tabIndex={-1} key={record._id}>
                                <TableCell size="small" align="center">
                                    <Link
                                        target="_blank"
                                        rel="noopener"
                                        color="inherit"
                                        href={`https://steamcommunity.com/stats/Portal2/leaderboards/${record._id}`}
                                    >
                                        {record.name}
                                    </Link>
                                </TableCell>
                                <TableCell size="small" align="center">
                                    {score}
                                </TableCell>
                                <TableCell size="small" align="center">
                                    {delta}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProfileTable;
