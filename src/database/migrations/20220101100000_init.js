const appSettings = require('../../appSettings');

const { dbSchema } = appSettings;

exports.up = (knex) => knex.schema.withSchema(dbSchema).raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

exports.down = (knex) => {};
