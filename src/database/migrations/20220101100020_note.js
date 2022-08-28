const { addDefaultFields } = require('mdo-backend-tools');
const appSettings = require('../../appSettings');

const { dbSchema } = appSettings;

exports.up = (knex) =>
  knex.schema.withSchema(dbSchema).createTable('note', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('group_id').comment('Reference to the note group');
    table.foreign('group_id').references('group.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.text('note_title').notNullable().comment('Note title');
    table.text('note_body').notNullable().comment('Note text');

    // Add created_at, etc if needUser = true, then add created_by, etc
    addDefaultFields(table, { needUser: true });

    table.comment('User notes');
  });

exports.down = (knex) => knex.schema.withSchema(dbSchema).dropTableIfExists('note');
