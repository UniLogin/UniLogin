/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.alterTable('messages', (table) => {
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex('messages').update({created_at: '2015-07-30'});
};

exports.down = async (knex) => {
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('created_at');
  });
};
