/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.renameTable('deployments', 'deployments_temp');
  await knex.schema.createTable('deployments', (table) => {
    table.increments().primary();
    table.string('hash', 66).notNullable();
    table.string('publicKey', 42).notNullable();
    table.string('ensName').notNullable();
    table.string('gasPrice').notNullable();
    table.string('gasToken').notNullable();
    table.string('signature').notNullable();
    table.json('deviceInfo').notNullable();
    table.string('state', 30);
    table.text('error');
    table.string('transactionHash', 66);
  });

  const data = await knex.table('deployments_temp').select();
  await knex('deployments').insert(data);

  await knex.schema.dropTable('deployments_temp');
};

exports.down = async (knex) => {
  await knex.schema.renameTable('deployments', 'deployments_temp');
  await knex.schema.createTable('deployments', (table) => {
    table.string('hash').primary().notNullable();
    table.string('publicKey').notNullable();
    table.string('ensName').notNullable();
    table.string('gasPrice').notNullable();
    table.string('gasToken').notNullable();
    table.string('signature').notNullable();
    table.json('deviceInfo').notNullable();
    table.string('state', 30);
    table.text('error');
    table.string('transactionHash', 66);
  });

  const data = await knex.table('deployments_temp').select('hash', 'publicKey', 'ensName', 'gasPrice', 'gasToken', 'signature', 'deviceInfo', 'state', 'error', 'transactionHash')
    .whereIn('id',
      knex('deployments_temp').max('id').groupBy('hash'),
    );
  await knex('deployments').insert(data);

  await knex.schema.dropTable('deployments_temp');
};
