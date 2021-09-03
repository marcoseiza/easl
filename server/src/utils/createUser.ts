import { getRepository } from "typeorm";
import { User } from "../entity/User";

export interface CreateUserInfo {
  username: string;
  githubId: string;
  pictureUrl: string;
  bio: string;
  name: string;
}

export const createUser =
  async (userInfo: CreateUserInfo): Promise<User | undefined> => {
    let user: User | undefined = undefined;
    let times = 0;

    while (times < 100) {
      try {
        user = await getRepository(User).save({
          ...userInfo,
          username: times ? `${userInfo.username}${times}` : userInfo.username,
        });
        break;
      } catch (err) {
        if (!err.detail.includes("already exists")) {
          throw err;
        }
      }
      times++;
    }

    return user;
  };