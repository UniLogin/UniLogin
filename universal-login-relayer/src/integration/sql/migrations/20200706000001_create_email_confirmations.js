/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('email_confirmations', (table) => {
    table.increments();
    table.string('email').notNullable();
    table.string('ensName').notNullable();
    table.string('code').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.boolean('isConfirmed').notNullable().defaultTo(false);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('email_confirmations');
};
