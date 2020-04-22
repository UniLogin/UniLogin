/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('refund_payers', (table) => {
    table.increments();
    table.string('name', 128).notNullable();
    table.string('apiKey', 64).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('refund_payers');
};
