import 'reflect-metadata';

import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import * as passport from 'passport';
import { Server, Socket } from 'socket.io';
import * as cors from 'cors';
import * as Redis from "ioredis";
import * as connectRedis from 'connect-redis'
import * as session from "express-session";
import { RedisClient } from 'redis';
import * as typeorm from 'typeorm';

import {
  createTypeormConnection,
  createGitHubStrategy,
  CLIENT_HOST_NAME,
  SERVER_PORT,
  CLIENT_HOST_NAME_DEV
} from './utils';
import { createApolloServer } from './utils/createApolloServer';
import { Container } from 'typeorm-typedi-extensions';

dotenv.config({ path: __dirname + '/../.env' });

const redis =
  process.env.NODE_ENV === "production"
    ? new Redis(process.env.REDIS_URL)
    : new Redis();

// Connect node.req.session to redis backing store.
const RedisStore = connectRedis(session);

typeorm.useContainer(Container);

async function main() {

  console.log(`Creating database connection...`);
  const conn = await createTypeormConnection();
  conn && await conn.runMigrations()

  console.log("Creating express server...");
  const app = express();

  console.log("Creating GQL server...");
  const server = await createApolloServer();

  app.set("trust proxy", 1);

  app.use(cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? CLIENT_HOST_NAME
        : CLIENT_HOST_NAME_DEV,
  }))

  app.use(session({
    store: new RedisStore({
      client: (redis as unknown) as RedisClient,
    }),
    name: "easlqid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365, // = 1 year
    }
  }));

  passport.use(createGitHubStrategy());

  app.use(passport.initialize());

  passport.serializeUser((user: any, cb) => { cb(null, user); });

  passport.deserializeUser((user: any, cb) => { cb(null, user); });

  app.get('/auth', passport.authenticate('github', { session: false }));

  app.get('/auth/callback',
    passport.authenticate(
      'github',
      {
        failureRedirect: `${CLIENT_HOST_NAME}/login`,
        session: false
      }
    ),
    (req: any, res) => {

      if (req.user.user.id && req.session) {
        req.session.userId = req.user.user.id;
        req.session.accessToken = req.user.accessToken;
        req.session.refreshToken = req.user.refreshToken;
      }
      // Successful authentication, redirect home.
      res.redirect(CLIENT_HOST_NAME);
    }
  );

  app.get('/session', (req, res) => {
    res.send(req.session);
  })

  await server.start();

  server.applyMiddleware({ app, cors: false });

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_HOST_NAME,
      methods: ["GEST", "POST"]
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("Connected to web socket.");

    socket.on("get-doc", docId => {
      // TODO: Get doc from github.
      const doc = "";
      socket.join(docId);
      socket.emit("load-doc", doc);

      socket.on("send-changes", val => {
        socket.broadcast.to(docId).emit("recieve-changes", val);
      });

    });
  });

  httpServer.listen(SERVER_PORT, () => {
    console.log(`🚀 Server ready on port: ${SERVER_PORT}`)
  });

}

main();