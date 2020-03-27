/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('future_wallets', (table) => {
    table.string('contractAddress', 42).notNullable();
    table.string('publicKey').notNullable();
    table.string('gasPrice').notNullable();
    table.string('gasToken').notNullable();
    table.string('ensName').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

exports.down = async (knex) => {
  await knex.schema.dropTable('future_wallets');
}
