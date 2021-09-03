import React from 'react';
import MdHeader from './components/md-header';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import GitHubLogin from './components/git-hub-login';
import { Fab } from '@material-ui/core';

import { ExternalRedirect } from './helpers';

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/login" component={GitHubLogin} />
        <Route exact={true} path="/document/:id" component={MdHeader} />
        <Route exact={true} path="/">
          <Fab variant="extended" color="primary" aria-label="log in" href={`/document/${uuidV4()}`}>
            Make a doc
          </Fab>
        </Route>
        <ExternalRedirect
          exact={true}
          path="/graphql"
          link="http://localhost:3001/graphql"
        />
      </Switch>
    </Router>
  );
}

export default App;
