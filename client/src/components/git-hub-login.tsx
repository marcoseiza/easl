import * as React from 'react';
import { Fab, Grid, Paper, makeStyles } from '@material-ui/core';
import { DefaultTheme as Theme } from '@material-ui/styles';
import { GitHub } from '@material-ui/icons';
import { LOGIN_URL } from '../constants';

const styles = makeStyles((theme: Theme) => ({
  paper: {
    width: 280,
    height: 300,
    padding: 30
  },
  extendedIcon: {
    marginRight: 10,
  }
}));

export const GitHubLogin: React.FC = () => {

  const classes = styles();

  return (
    <Grid
      container
      style={{ width: '100vw', height: '100vh' }}
      justifyContent={'center'}
      alignContent={'center'}
    >
      <Paper elevation={2} className={classes.paper} >
        <Grid
          container
          style={{ width: '100%', height: '100%' }}
          alignContent={'center'}
          justifyContent={'center'}
          direction={'column'}
        >
          <Fab variant="extended" color="primary" aria-label="log in" href={LOGIN_URL}>
            <GitHub className={classes.extendedIcon} />
            Login to github
          </Fab>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default GitHubLogin;