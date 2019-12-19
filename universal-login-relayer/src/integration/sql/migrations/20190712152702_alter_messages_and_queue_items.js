/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.alterTable('queue_items', (table) => {
    table.string('type', 30).notNullable().defaultTo('Message');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('createdAt');
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('queue_items', (table) => {
    table.dropColumn('type');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
  });
};
