import knex from 'knex';
import appSettings from './appSettings';
import knexConfig from './knexConfig';

const knexHandle = knex(knexConfig);

/**
 * Running DB migrations using Knex library
 * @returns
 */
const runMigrations = () => {
  return runMigrations(knexHandle, appSettings);
};

module.exports = runMigrations;
