import {
  Box,
  createStyles,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { useOctokit, useAsync } from '../helpers';
import { Profile } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 0
    },
    item: {
      // borderTop: `1px solid ${theme.palette.primary.dark}`, 
      borderBottom: `1px solid ${theme.palette.primary.dark}`,
      padding: 0,
      '& + $item': {
        borderTop: `none`,
        borderBottom: `1px solid ${theme.palette.primary.dark}`,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    link: {
      textDecoration: "none",
      color: theme.palette.text.primary,
      padding: '8px 16px',
      flexGrow: 1,
    }
  }),
);

export const AllRepos: React.FC = () => {
  const classes = useStyles();

  const octokit = useOctokit();

  const { value } = useAsync(async () => {
    return await octokit?.repos.listForAuthenticatedUser();
  }, [octokit]) as any;

  return (
    <Box display="flex" flexDirection="row" alignItems="start">
      <Profile />
      <List aria-label="all repos" className={classes.root}>
        {value?.data.map((repo: any, index: number) => (
          <ListItem key={index} className={classes.item}>
            <Link to={`/${repo.full_name}/`} className={classes.link}>
              <ListItemText primary={repo.full_name} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AllRepos;