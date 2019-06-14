/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.renameTable('transactions', 'finalMessages');
  await knex.schema.alterTable('finalMessages', (table) => {
    table.string('hash', 66).alter();
    table.text('error').alter();
    table.renameColumn('hash', 'transactionHash');
    table.dropColumn('id');
    table.string('messageHash', 66).notNullable().primary();
  })
}

exports.down = async (knex) => {
  await knex.schema.renameTable('finalMessages', 'transactions');
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('messageHash');
    table.renameColumn('transactionHash', 'hash');
  });
  await knex.schema.alterTable('transactions', (table) => {
    table.string('error').alter();
    table.string('hash').alter();
    table.increments();
  });
}