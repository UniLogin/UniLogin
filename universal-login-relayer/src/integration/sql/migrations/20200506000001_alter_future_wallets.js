/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.table('future_wallets', (table) => {
    table.string('tokenPriceInETH', 64).notNullable().defaultTo('1');
  });

  await knex('future_wallets').update({tokenPriceInETH: '1'});
};

exports.down = async (knex) => {
  await knex.schema.table('future_wallets', (table) => {
    table.dropColumn('tokenPriceInETH');
  });
};
