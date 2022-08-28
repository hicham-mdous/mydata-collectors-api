import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';

import { logger } from './utils/logger';

import typeDefs from './app/graphql/types';
import resolvers from './app/graphql/resolvers';

import { createContext } from './context';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

import * as controllers from './app/restapi';

import { RESULT_CODES } from 'mdo-backend-tools';

import appSettings from './appSettings';

const run = async () => {
  const { isProduction, port, maxReqBodySize } = appSettings;

  const corsOptions = {
    origin: (origin, callback) => {
      // on allowed:
      callback(null, true);
      // on forbidden:
      // callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  };

  const app = express();
  app.use(cors(corsOptions));

  app.use(express.json({ limit: maxReqBodySize }));
  app.use(express.urlencoded({ limit: maxReqBodySize, extended: true }));

  app.get('/', (req, res) => {
    res.status(200).send(`Alive for ${'environment'}`);
  });

  app.use(async (req: any, res: any, next: any) => {
    if (req.path !== '/graphql') {
      req.context = await createContext({ req });
    }
    next();
  });

  // REST API
  // Set entry point API handlers
  Object.keys(controllers).forEach((key) => {
    const controller = new controllers[key]();
    controller.init({ app });
  });

  const apolloServer = new ApolloServer({
    //schema: makeExecutableSchema({ typeDefs, resolvers }),
    schema: buildSubgraphSchema([{ typeDefs, resolvers: resolvers as any }]),
    context: createContext,
    debug: !isProduction,
    plugins: [
      {
        requestDidStart: async (/*requestContext*/) => {
          /* Within this returned object, define functions that respond
              to request-specific lifecycle events. */
          return {
            willSendResponse: async (/*requestContext*/) => {
              // TODO: clean up resources if any
            },
          };
        },
      },
      isProduction ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions });

  app.use('*', (req, res) => {
    // This is app's not found handler
    res.status(404).json({ code: RESULT_CODES.NOT_FOUND });
  });

  app.listen({ port }, () => {
    logger.log(`Listening on port ${port}`);
  });
};

run();
