import React from 'react'
import { Octokit } from '@octokit/rest';

export interface OctokitProviderProps {
  octokit: Octokit;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const OctokitContext = React.createContext<Octokit | undefined>(undefined);

export const OctokitProvider: React.FC<OctokitProviderProps> =
  ({ octokit, children }) => {
    return (<OctokitContext.Provider value={octokit}>{children}</OctokitContext.Provider>);
  };

export const useOctokit = () => React.useContext(OctokitContext);