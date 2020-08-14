/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.alterTable('encrypted_wallets', (table) => {
    table.string('contractAddress').notNullable().defaultTo('0x0000000000000000000000000000000000000000');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('encrypted_wallets', (table) => {
    table.dropColumn('contractAddress');
  });
};
