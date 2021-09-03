import 'reflect-metadata';

import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import * as passport from 'passport';
import { Server, Socket } from 'socket.io';
import { Container } from "typedi";
import * as typeorm from 'typeorm';


import {
  createTypeormConnection,
  createSession,
  createGitHubStrategy,
  CLIENT_HOST_NAME,
  SERVER_PORT
} from './utils';
import { createApolloServer } from './utils/createApolloServer';

dotenv.config({ path: __dirname + '/../.env' });

typeorm.useContainer(Container);

async function main() {

  const connection = await createTypeormConnection();

  connection && await connection.runMigrations();

  const app = express();

  const server = await createApolloServer();

  await server.start();

  server.applyMiddleware({ app, cors: false });

  app.use(createSession());

  app.use(passport.initialize());

  app.use(passport.session());

  passport.serializeUser((user: any, cb) => { cb(null, user); });

  passport.deserializeUser((user: any, cb) => { cb(null, user); });

  passport.use(createGitHubStrategy());

  passport.session();

  app.get('/auth', passport.authenticate('github', { session: false }));

  app.get('/auth/callback',
    passport.authenticate(
      'github',
      { failureRedirect: `${CLIENT_HOST_NAME}/login` }
    ),
    (_req, res) => {
      // Successful authentication, redirect home.
      res.redirect(CLIENT_HOST_NAME);
    }
  );

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_HOST_NAME,
      methods: ["GEST", "POST"]
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("connected");

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
    console.log(`Server started on port: ${SERVER_PORT}`)
  });

}

main();