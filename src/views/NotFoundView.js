import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const NotFoundView = () => {
    return (
        <Grid container>
            <Grid item xs={false} md={1} lg={2} />
            <Grid item xs={12} md={10} lg={9}>
                <Paper>
                    <Typography variant="h5" gutterBottom style={{ padding: '50px 0px 50px 50px' }}>
                        Page not found :(
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default NotFoundView;
