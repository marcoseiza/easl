import * as React from 'react';

import { Box, Grid, useTheme } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
  GitHubLogin,
  Links,
  MdHeader,
  Repo,
  AllRepos
} from './components';
import { ExternalRedirect } from './helpers';

function App(): JSX.Element {
  const theme = useTheme();

  document.body.style.backgroundColor = theme.palette.primary.main;

  const lineHeight = theme.typography.body2.lineHeight || 0;

  return (
    <Router>
      <Box display="grid" style={{
        width: '100vw',
        height: '100vh',
        gridTemplateRows: `auto minmax(0, 1fr)`
      }}>
        <Box style={{ width: '100vw' }}>
          <Links />
        </Box>
        <Box style={{ width: '100vw' }}>
          <Switch>
            <Route exact path="/" component={AllRepos} />
            <Route strict path="/:owner/:repo/" component={Repo} />
            <Route exact path="/document/:id" component={MdHeader} />
            <Route exact path="/login" component={GitHubLogin} />
            <ExternalRedirect
              exact
              path="/graphql"
              link="http://localhost:3001/graphql"
            />
          </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
