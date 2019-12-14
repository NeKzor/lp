import React from 'react';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ScoresTable from '../components/ScoresTable';
import AppState from '../AppState';
import Api from '../Api';
import { useIsMounted } from '../Hooks';

const ScoreboardView = ({ boardType }) => {
    const isMounted = useIsMounted();

    const [board, setBoard] = React.useState([]);
    const { dispatch } = React.useContext(AppState);

    React.useEffect(() => {
        if (board.length === 0) {
            Api.getBoard(boardType)
                .then(board => isMounted.current && setBoard(board))
                .catch(err => console.error(err));
        }
    }, []);

    const handleProfileOpen = (_, id) => {
        Api.getPlayer(id)
            .then(data => isMounted.current && dispatch({ action: 'setProfile', data: { id, data } }))
            .catch(err => console.error(err));
    };

    return (
        <>
            <Grid container>
                <Grid item xs={false} md={1} lg={3} />
                <Grid item xs={12} md={10} lg={6}>
                    <Paper>
                        {board.length === 0 && <LinearProgress />}
                        <ScoresTable data={board} handleClickOpen={handleProfileOpen} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default ScoreboardView;
