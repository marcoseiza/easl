import { Octokit } from '@octokit/rest';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Route } from 'react-router';

import { useOctokit, useAsync } from '../../helpers';
import { FileTree, File } from '.';

export interface TreeItemInfo {
  path: string;
  name: string;
  type: "blob" | "tree";
  sha: string;
  children: TreeItemInfo[] | undefined;
}

const sortAlpha = (a: TreeItemInfo, b: TreeItemInfo) => {
  const astr = a.path.toUpperCase(), bstr = b.path.toUpperCase();
  if (astr < bstr) return -1;
  if (astr > bstr) return 1;
  return 0;
}

const sortTree = (a: TreeItemInfo, b: TreeItemInfo) => {
  if (a.type === 'tree' && b.type !== 'tree') return -1;
  if (b.type === 'tree' && a.type !== 'tree') return 1;
  return sortAlpha(a, b);
}

const getTree = async (
  depth: number,
  octokit: Octokit | undefined,
  owner: string,
  repo: string,
  sha: string,
  parentPath: string = "",
): Promise<TreeItemInfo[]> => {
  const tree = (await octokit?.git.getTree({
    owner,
    repo,
    tree_sha: sha
  }) as any).data.tree.sort(sortTree);

  return Promise.all(tree.map(async (item: any): Promise<TreeItemInfo> => ({
    path: `${parentPath}/${item.path}`,
    name: item.path,
    type: item.type,
    sha: item.sha,
    children: (item.type === 'tree' && depth > 0) ?
      (await getTree(depth - 1, octokit, owner, repo, item.sha, `${parentPath}/${item.path}`)).sort(sortTree)
      :
      undefined,
  })));
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    content: {
      flexGrow: 1,
      width: `20%`,
    },
    fileGutter: {
      overflow: 'scroll',
      flexGrow: 1,
      backgroundColor: theme.palette.primary.dark
    },
    title: {
      padding: '4px 24px',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.primary.light,
      fontWeight: 'bold',
    }
  }));


export const Repo: React.FC = () => {

  const classes = useStyles();

  const { owner, repo } = useParams() as any;

  const octokit = useOctokit();

  const { value } = useAsync(async () => {
    return await getTree(1, octokit, owner, repo, "master");
  }, [octokit]);

  return (
    <>
      <Box display="flex" flexDirection="row" className={classes.root}>
        <Box display="flex" flexDirection="column" className={classes.content}>
          <Typography variant="body2" className={classes.title}>
            {`${owner}/${repo}`}
          </Typography>
          <Box className={classes.fileGutter}>
            {value &&
              <FileTree
                items={value}
                rootUrl={`/${owner}/${repo}`}
                getTreeChildren={getTree.bind(null, 1, octokit, owner, repo)}
              />}
          </Box>
        </Box>
        <Box width="80%">
          <Route path={`/${owner}/${repo}/*`} >
            <File octokit={octokit} owner={owner} repo={repo} />
          </Route>
        </Box>
      </Box>
    </>
  );
}

export default Repo;