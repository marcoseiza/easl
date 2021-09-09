import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import "./styles/index.css"

import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache
} from "@apollo/client";
import { Octokit } from '@octokit/rest';
import { OctokitProvider } from './helpers/octokit-provider';
import 'codemirror/mode/markdown/markdown';
import { ThemeProvider } from '@material-ui/core';
import { theme } from './styles/theme';

const startApp = async () => {

  const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
    credentials: "include",
  });

  const { data: { me: { accessToken } } } = await client.query({
    query: gql`{ me { accessToken } }`
  }) as any;

  const octokit = new Octokit({
    auth: accessToken,
    headers: {
      accept: "application/vnd.github.foo-bar-preview+json"
    },
  });

  ReactDOM.render(
    <>
      <ApolloProvider client={client}>
        <OctokitProvider octokit={octokit}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </OctokitProvider>
      </ApolloProvider>
    </>,
    document.getElementById('root')
  );

}

startApp();