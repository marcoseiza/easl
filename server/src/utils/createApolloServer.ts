import { ApolloServer, ApolloError } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { Request } from 'express';
import { v4 } from 'uuid';

import { UserResolver } from '../resolvers';
import { userLoader } from '../loaders';
import { DisplayError } from '../errors';
import { Container } from 'typeorm-typedi-extensions';

export const createApolloServer = async () => new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver],
    container: Container,
  }),
  context: ({ req }: { req: Request }) => ({
    req,
    userLoader: userLoader()
  }),
  formatError: (error: GraphQLError) => {
    if (
      error.originalError instanceof ApolloError ||
      error.originalError instanceof DisplayError
    ) {
      return error;
    }

    const errId = v4();
    console.log("errId: ", errId);
    console.error(error);

    return new GraphQLError(`Internal Error: ${errId}`);
  },
  debug: undefined,
  rootValue: undefined,
  validationRules: undefined,
  executor: undefined,
  formatResponse: undefined,
  fieldResolver: undefined,
  dataSources: undefined,
  cache: undefined,
  logger: undefined,
});