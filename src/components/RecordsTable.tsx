import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import stableSort from '../utils/stableSort';
import Showcase from './Showcase';

const rows = [
    { id: 'index', numeric: false, sortable: true, label: 'Map' },
    { id: 'wr', numeric: true, sortable: true, label: 'Portals' },
    { id: 'ties', numeric: true, sortable: true, label: 'Ties' },
];

type RecordsTableHeadProps = {
    order: 'asc' | 'desc';
    orderBy: string;
    onRequestSort: any;
};

const RecordsTableHead = ({ order, orderBy, onRequestSort }: RecordsTableHeadProps) => {
    const createSortHandler = (property: any) => (event: any) => {
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

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'auto',
    },
    helpLink: {
        cursor: 'help',
    },
    showcase: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey['A400'] : theme.palette.grey['50'],
        paddingBottom: 0,
        paddingTop: 0,
    },
}));

type RecordsTableProps = {
    data: any;
};

type RecordsTableState = {
    order: 'asc' | 'desc';
    orderBy: string;
    page: number;
    rowsPerPage: 100;
};

const RecordsTable = ({ data }: RecordsTableProps) => {
    const [state, setState] = React.useState<RecordsTableState>({
        order: 'asc',
        orderBy: 'index',
        page: 0,
        rowsPerPage: 100,
    });
    const [curRecord, setCurRecord] = React.useState(0);

    const handleRequestSort = (_: any, property: any) => {
        const orderBy = property;
        let order: 'asc' | 'desc' = 'desc';

        if (state.orderBy === property && state.order === 'desc') {
            order = 'asc';
        }

        setState((state) => ({ ...state, order, orderBy }));
    };

    const classes = useStyles();

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

    const handleRowClick = (id: any) => () => {
        setCurRecord(curRecord !== id ? id : 0);
    };

    const { order, orderBy } = state;

    return (
        <div className={classes.root}>
            <Table>
                <RecordsTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {stableSort(data, order, orderBy).map((record) => {
                        return (
                            <React.Fragment key={record.id}>
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    onClick={handleRowClick(record.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell size="small">
                                        <Link
                                            target="_blank"
                                            rel="noopener"
                                            color="inherit"
                                            href={`https://steamcommunity.com/stats/Portal2/leaderboards/${record.id}`}
                                        >
                                            {record.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell size="small" align="center">
                                        {record.wr}
                                    </TableCell>
                                    <TableCell size="small" align="center">
                                        {record.excluded === true ? <ExcludedMapsInfo /> : record.ties}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        size="small"
                                        className={classes.showcase}
                                        colSpan={3}
                                        style={{ border: record.id !== curRecord ? 0 : undefined }}
                                    >
                                        <Collapse in={record.id === curRecord} timeout="auto" unmountOnExit>
                                            <Grid container>
                                                {record.showcases.length === 1 && (
                                                    <>
                                                        <Hidden smDown>
                                                            <Grid item md={2} lg={2} />
                                                        </Hidden>
                                                        <Grid item xs={12} md={8} lg={8}>
                                                            <Showcase data={record.showcases[0]} />
                                                        </Grid>
                                                    </>
                                                )}
                                                {record.showcases.length > 1 &&
                                                    record.showcases.map((showcase: any, idx: number) => (
                                                        <Grid key={idx} item xs={12} md={6} lg={6}>
                                                            <Showcase data={showcase} />
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecordsTable;
