/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.renameTable('messages', 'messages_temp');
  await knex.schema.createTable('messages', (table) => {
    table.increments().primary();
    table.string('hash', 66).unique().notNullable();
    table.string('walletAddress', 42).notNullable();
    table.json('message');
    table.string('state', 30);
    table.text('error');
    table.string('transactionHash', 66);
  });
  await knex.schema.table('signature_key_pairs', table => {
    table.dropForeign('messageHash');
    table.foreign('messageHash').references('hash').inTable('messages');
  });

  const data = await knex.table('messages_temp').select();
  await knex('messages').insert(data);
  await knex.schema.dropTable('messages_temp');
};

exports.down = async (knex) => {
  await knex.schema.renameTable('messages', 'messages_temp');
  await knex.schema.createTable('messages', (table) => {
    table.string('hash').primary();
    table.string('walletAddress').notNullable();
    table.json('message');
    table.string('state', 30);
    table.text('error');
    table.string('transactionHash');
  });
  await knex.schema.table('signature_key_pairs', table => {
    table.dropForeign('messageHash');
    table.foreign('messageHash').references('hash').inTable('messages');
  });

  const data = await knex.table('messages_temp').select('hash', 'walletAddress', 'message', 'state', 'error', 'transactionHash');
  await knex('messages').insert(data);
  await knex.schema.dropTable('messages_temp');
};
