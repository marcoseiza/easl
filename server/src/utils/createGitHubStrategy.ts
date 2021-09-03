import { Profile, Strategy as GitHubStrategy } from 'passport-github';
import * as typeorm from 'typeorm';

import { createUser } from '.';
import { User } from '../entity';
import { SERVER_HOST_NAME } from './constants';

export interface UserProfile extends Profile {
  _json: {
    [key: string]: string;
  };
}

export const createGitHubStrategy = () => new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: `${SERVER_HOST_NAME}/auth/callback`,
    scope: "repo",
  },
  async (accessToken, refreshToken, profile_, cb) => {
    const profile = profile_ as UserProfile;

    let user = await typeorm
      .getRepository(User)
      .findOne({ where: { githubId: profile.id } });

    if (!user) {
      user = await createUser({
        username: profile.username || "",
        githubId: profile.id,
        pictureUrl: profile._json.avatar_url,
        bio: profile._json.bio,
        name: profile._json.name,
      });
    }

    cb(null, {
      user,
      accessToken,
      refreshToken
    });
  }
)