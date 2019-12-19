/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  // This `if` is only needed because the previous migration file was changed
  if (await knex.schema.hasColumn('authorisations', 'identityAddress')) {
    await knex.schema.alterTable('authorisations', (table) => {
      table.renameColumn('identityAddress', 'walletContractAddress');
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.alterTable('authorisations', (table) => {
    table.renameColumn('walletContractAddress', 'identityAddress');
  });
};
