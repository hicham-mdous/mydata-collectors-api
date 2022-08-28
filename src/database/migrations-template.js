// const { addDefaults } = require('mdo-backend-tools');
// const appSettings = require('../appSettings');

// const { dbSchema } = appSettings;

// exports.up = (knex) =>
//   knex.schema.withSchema(dbSchema).createTable('new_table', (table) => {
//     table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
//     table.text('text_field_name').notNullable().comment('Field Description');

//     // Add created_at, etc if needUser = true, then add created_by, etc
//     addDefaults(table, { needUser: false });

//     table.comment('new_table');
//   });

// exports.down = (knex) => knex.schema.withSchema(dbSchema).dropTableIfExists('new_table');
