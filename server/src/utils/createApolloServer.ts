import { ApolloServer, ApolloError } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { GraphQLError } from 'graphql';
// import { Request } from 'express';
import { v4 } from 'uuid';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';


import { UserResolver } from '../resolvers';
import { DisplayError } from '../errors';
import { Container } from 'typeorm-typedi-extensions';

export const createApolloServer = async () => new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver],
    container: Container
  } as any),
  context: ({ req }) => ({ req }),
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
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground
  ],
} as any);