/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.renameTable('finalMessages', 'queue_items');
  await knex.schema.alterTable('queue_items', (table) => {
    table.renameColumn('messageHash', 'hash');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.text('error');
    table.json('message');
  });
};

exports.down = async (knex) => {
  await knex.schema.renameTable('queue_items', 'finalMessages');
  await knex.schema.alterTable('finalMessages', (table) => {
    table.renameColumn('hash', 'messageHash');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('error');
    table.dropColumn('message');
  });
};
