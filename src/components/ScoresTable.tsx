import React from 'react';
import Flag from 'react-world-flags';
import { library as fa } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
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

type ScoresTableHeadProps = {
    order: 'asc' | 'desc';
    orderBy: string;
    onRequestSort: any;
};

const ScoresTableHead = ({ order, orderBy, onRequestSort }: ScoresTableHeadProps) => {
    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {rows.map((row) => (
                    <TableCell
                        key={row.id}
                        align={row.numeric ? 'center' : 'left'}
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
                ))}
            </TableRow>
        </TableHead>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'auto',
    },
    profile: {
        alignItems: 'center',
    },
    avatar: {
        cursor: 'pointer',
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginRight: 10,
    },
    playerLink: {
        cursor: 'pointer',
        marginRight: 10,
    },
}));

type ScoresTableProps = {
    data: any;
    handleClickOpen: any;
};

type ScoresTableState = {
    order: 'asc' | 'desc';
    orderBy: string;
};

const ScoresTable = ({ data, handleClickOpen }: ScoresTableProps) => {
    const [state, setState] = React.useState<ScoresTableState>({
        order: 'asc',
        orderBy: 'score',
    });

    const handleRequestSort = (_: any, property: any) => {
        const orderBy = property;
        let order: 'asc' | 'desc' = 'desc';

        if (state.orderBy === property && state.order === 'desc') {
            order = 'asc';
        }

        setState((state) => ({ ...state, order, orderBy }));
    };

    const classes = useStyles();
    const { order, orderBy } = state;

    return (
        <div className={classes.root}>
            <Table>
                <ScoresTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {stableSort(data, order, orderBy).map((item) => {
                        return (
                            <TableRow hover tabIndex={-1} key={item._id}>
                                <TableCell size="small" align="center">
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
                                <TableCell size="small">
                                    <Grid container direction="row" className={classes.profile}>
                                        <Grid item>
                                            <Avatar
                                                onClick={handleClickOpen(item._id)}
                                                className={classes.avatar}
                                                src={item.avatar.slice(0, -4) + '_medium.jpg'}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Link
                                                className={classes.playerLink}
                                                onClick={handleClickOpen(item._id)}
                                                color="inherit"
                                                noWrap
                                            >
                                                {item.name}
                                            </Link>
                                        </Grid>
                                        {item.country && (
                                            <Grid item>
                                                <Flag
                                                    code={item.country}
                                                    height="12"
                                                    alt={item.country}
                                                    title={item.country}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </TableCell>
                                <TableCell size="small" align="center">
                                    <Tooltip
                                        placement="top"
                                        title={
                                            <div>
                                                {`${item.stats.percentage}% (${item.score - item.stats.delta}+${
                                                    item.stats.delta
                                                })`}
                                                {item.scoreOld !== item.score && (
                                                    <>
                                                        <br />
                                                        {item.scoreOld + ' 🠊 ' + item.score}
                                                    </>
                                                )}
                                            </div>
                                        }
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
    );
};

export default ScoresTable;
