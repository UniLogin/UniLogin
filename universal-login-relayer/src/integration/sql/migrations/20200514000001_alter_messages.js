/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.alterTable('messages', (table) => table.string('tokenPriceInEth', 64).defaultTo('1'));
  await knex.schema.alterTable('messages', (table) => table.string('tokenPriceInEth', 64).notNullable().alter());
};

exports.down = async (knex) => {
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('tokenPriceInEth');
  });
};
