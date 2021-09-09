import { Octokit } from '@octokit/rest';
import * as React from 'react';
import cm from 'codemirror';
import 'codemirror/mode/meta';
import { useParams } from 'react-router-dom';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { useAsync } from '../../helpers';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    codeMirror: {
      height: '100%',
      "& .CodeMirror": {
        boxShadow: "none !important",
        height: `100%`,
        outline: `none`,
      },
      "& .CodeMirror-gutters": {
        backgroundColor: theme.palette.background.default + ' !important'
      }
    }
  }));

export interface FileProps {
  octokit: Octokit | undefined;
  owner: string;
  repo: string;
}

export const File: React.FC<FileProps> = ({ octokit, owner, repo }) => {

  const classes = useStyles();

  const path = (useParams() as any)[0] || "README.md";

  const file = useAsync(async () => {
    try {
      const { data } = (await octokit?.repos.getContent({
        owner,
        repo,
        path
      }) as any);
      return (data?.encoding === 'base64') ? atob(data.content) : undefined;
    } catch (e) {
      return null;
    }
  }, [octokit, owner, repo, path]);

  const mode = cm.findModeByFileName(path)?.mode;
  mode && mode !== 'null' && require(`codemirror/mode/${mode}/${mode}.js`);

  return (
    file.value !== undefined ?
      <CodeMirror
        value={file.value ? file.value : "File is too large..."}
        options={{
          mode: {
            name: mode || "",
          },
          theme: 'solarized dark',
          readOnly: true,
          lineNumbers: file !== null,
          fixedGutter: false,
        }}
        className={classes.codeMirror}
      /> : null
  )
}