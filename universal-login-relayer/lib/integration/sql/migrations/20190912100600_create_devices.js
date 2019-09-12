/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('devices', (table) => {
    table.string('publicKey', 42).primary();
    table.string('contractAddress', 42).notNullable();
    table.json('deviceInfo');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('devices');
};
