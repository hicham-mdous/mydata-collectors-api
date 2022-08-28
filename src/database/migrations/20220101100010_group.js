const { addDefaultFields } = require('mdo-backend-tools');
const appSettings = require('../../appSettings');

const { dbSchema } = appSettings;

exports.up = (knex) =>
  knex.schema.withSchema(dbSchema).createTable('group', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('group_name').notNullable().comment('Notes group name');

    // Add created_at, etc if needUser = true, then add created_by, etc
    addDefaultFields(table, { needUser: true });

    table.unique(['group_name']);

    table.comment('User groups of notes');
  });

exports.down = (knex) => knex.schema.withSchema(dbSchema).dropTableIfExists('group');
