/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('messages', (table) => {
      table.string('messageHash').primary();
      table.string('transactionHash');
      table.string('walletAddress').notNullable();
      table.timestamp('createdAt').notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('messages');
};
