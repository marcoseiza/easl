import { Request } from "express";
import { User } from "./entity";
import * as DataLoader from "dataloader";

export interface Context {
  req: Request;
  userLoader: DataLoader<string, User>;
}