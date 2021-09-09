import * as React from 'react';

import {
  useQuery,
  gql
} from "@apollo/client";
import { Avatar, Box, Card, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: 20,
    },
    avatar: {
      width: 250,
      height: 250,
      marginBottom: 20,
    },
  }
  ));

export const Profile: React.FC = () => {
  const classes = useStyles();

  const { data } = useQuery(
    gql`
        {
          me {
            name
            username
            pictureUrl
            bio
          }
        }
      `
  );

  return (
    data ?
      <Card className={classes.card}>
        <Box display="flex" flexDirection="column">
          <Avatar alt="Avatar" src={data.me.pictureUrl} className={classes.avatar} />
          <Typography variant="h5">{data.me.name}</Typography>
          <Typography variant="h6">{`@${data.me.username}`}</Typography>
          <Typography variant="body1">{data.me.bio}</Typography>
        </Box>
      </Card>
      : null
  );
}

export default Profile;