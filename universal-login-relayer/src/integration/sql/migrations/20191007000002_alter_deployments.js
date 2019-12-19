/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.table('deployments', (table) => {
    table.string('state', 30);
    table.text('error');
    table.string('transactionHash', 66);
  });
};

exports.down = async (knex) => {
  await knex.schema.table('deployments', (table) => {
    table.dropColumn('state');
    table.dropColumn('error');
    table.dropColumn('transactionHash');
  });
};
