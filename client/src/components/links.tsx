import { Box, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import { NavLink, NavLinkProps, Route } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      height: 'auto',
      backgroundColor: theme.palette.primary.light,
    },
    navlink: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      borderRight: `1px solid ${theme.palette.primary.main}`,
    },
    activeNavlink: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.primary.main,
    }
  }));



export const Links: React.FC = () => {
  const classes = useStyles();

  const StyledNavLink = (props: NavLinkProps & { label: string }) => (
    <NavLink
      {...props}
      className={classes.navlink}
      activeClassName={classes.activeNavlink}
      children={
        <Typography variant="body2" style={{ color: 'inherit' }}>
          {props.label}
        </Typography>
      }
    />
  )

  return (
    <Box display="flex" className={classes.navBar}>
      <StyledNavLink exact to="/" label="Home" />
      <StyledNavLink exact to={`/document/${uuidV4()}`} label="Make Doc" />
      <StyledNavLink exact to="/login" label="Login" />
      <StyledNavLink exact to="/graphql" rel="noopener noreferrer" target="_blank" label="GraphQl" />
      <Route strict path="/:owner/:repo/" render={(props) => (
        <StyledNavLink strict to={`/${props.match.params.owner}/${props.match.params.repo}/`} label={`${props.match.params.owner}/${props.match.params.repo}`} />
      )} />
    </Box>
  );
}

export default Links;