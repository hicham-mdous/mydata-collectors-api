import { Database, createAppContext } from 'mdo-backend-tools';

import * as cores from './core';

import appSettings from './appSettings';
import knexHandle from './knexHandle';
import { logger } from './utils/logger';

/**
 * Creating a request context. The function is called on each request via GraphQL or REST API
 * @param args
 * @returns
 */
const createContext = async (args) => {
  const db = new Database({ knexHandle, schema: appSettings.dbSchema });
  return await createAppContext({ ...args, tokenSecret: appSettings.tokenSecret, db, cores, log: logger.log });
};

export { createContext };
