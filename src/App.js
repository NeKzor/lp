import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import AppBar from './components/AppBar';
import AboutView from './views/AboutView';
import RecordsView from './views/RecordsView';
import ScoreboardView from './views/ScoreboardView';
import Api from './Api';
import AppState, { AppReducer } from './AppState';
import NotFoundView from './views/NotFoundView';

const useStyles = makeStyles((theme) => ({
    views: {
        marginTop: theme.spacing(3),
    },
}));

const App = () => {
    const [state, dispatch] = React.useReducer(...AppReducer);

    React.useEffect(() => {
        Api.getRecords()
            .then((data) => dispatch({ action: 'setRecords', data }))
            .catch((err) => console.error(err));
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

    const tabs = ['/single-player', '/cooperative', '/overall', '/records', '/about'];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppState.Provider value={context}>
                <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/lp' : '/'}>
                    <Route
                        path="/"
                        render={({ location: { pathname } }) => (
                            <>
                                <AppBar currentTab={tabs.findIndex((x) => x === pathname)} />
                                {state.records.length !== 0 ? (
                                    <div className={classes.views}>
                                        <Switch>
                                            <Redirect exact from="/" to="/single-player" />
                                            <Redirect exact from="/sp" to="/single-player" />
                                            <Redirect exact from="/mp" to="/cooperative" />
                                            <Redirect exact from="/coop" to="/cooperative" />
                                            <Redirect exact from="/ov" to="/overall" />
                                            <Redirect exact from="/wrs" to="/records" />
                                            <Route
                                                exact
                                                path="/single-player"
                                                component={() => <ScoreboardView boardType="sp" />}
                                            />
                                            <Route
                                                exact
                                                path="/cooperative"
                                                component={() => <ScoreboardView boardType="mp" />}
                                            />
                                            <Route
                                                exact
                                                path="/overall"
                                                component={() => <ScoreboardView boardType="overall" />}
                                            />
                                            <Route exact path="/records" component={RecordsView} />
                                            <Route exact path="/about" component={AboutView} />
                                            <Route
                                                exact
                                                from="/@/:id"
                                                component={({ match: { params } }) => (
                                                    <ScoreboardView boardType="sp" profileId={params.id} />
                                                )}
                                            />
                                            <Route component={NotFoundView} />
                                        </Switch>
                                    </div>
                                ) : (
                                    <LinearProgress />
                                )}
                            </>
                        )}
                    />
                </BrowserRouter>
            </AppState.Provider>
        </ThemeProvider>
    );
};

export default App;
