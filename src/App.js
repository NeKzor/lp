import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import AppBar from './components/AppBar';
import ProfileDialog from './components/ProfileDialog';
import AboutView from './views/AboutView';
import RecordsView from './views/RecordsView';
import ScoreboardView from './views/ScoreboardView';
import Api from './Api';
import AppState, { AppReducer } from './AppState';

const useStyles = makeStyles((theme) => ({
    views: {
        marginTop: theme.spacing(3),
    },
}));

const App = () => {
    const [currentTab, setCurrentTab] = React.useState(3);
    const [state, dispatch] = React.useReducer(...AppReducer);

    React.useEffect(() => {
        Api.getRecords()
            .then(data => dispatch({ action: 'setRecords', data }))
            .catch(err => console.error(err));
    }, []);

    const theme = React.useMemo(() => {
        return createMuiTheme({
            palette: {
                primary: {
                    light: teal[300],
                    main: teal[500],
                    dark: teal[700],
                },
                secondary: {
                    light: '#fff',
                    main: '#fff',
                    dark: '#fff',
                },
                error: {
                    main: red.A400,
                },
                type: state.darkMode.enabled ? 'dark' : 'light',
            },
            typography: {
                useNextVariants: true,
            },
        });
    }, [state.darkMode.enabled]);

    const classes = useStyles();
    const context = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    const handleTabChange = (_, currentTab) => {
        setCurrentTab(currentTab);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppState.Provider value={context}>
                <AppBar currentTab={currentTab} onTabChange={handleTabChange} />
                {state.records.length !== 0 ? (
                    <div className={classes.views}>
                        {currentTab === 0 && <ScoreboardView boardType="sp" />}
                        {currentTab === 1 && <ScoreboardView boardType="coop" />}
                        {currentTab === 2 && <ScoreboardView boardType="overall" />}
                        {currentTab === 3 && <RecordsView />}
                        {currentTab === 4 && <AboutView />}
                    </div>
                ) : (
                    <LinearProgress />
                )}
                <ProfileDialog />
            </AppState.Provider>
        </ThemeProvider>
    );
};

export default App;
