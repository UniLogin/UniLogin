/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('encrypted_wallets', (table) => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('ensName').notNullable();
    table.string('walletJSON', 900).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('encrypted_wallets');
};
