/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('deployments', (table) => {
    table.string('hash').primary().notNullable();
    table.string('publicKey').notNullable();
    table.string('ensName').notNullable();
    table.string('gasPrice').notNullable();
    table.string('gasToken').notNullable();
    table.string('signature').notNullable();
  });

  await knex.schema.table('messages', (table) => {
    table.renameColumn('messageHash', 'hash');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('deployments');

  await knex.schema.table('messages', (table) => {
    table.renameColumn('hash', 'messageHash');
  });
};
