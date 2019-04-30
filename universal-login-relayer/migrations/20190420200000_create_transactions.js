/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
    await knex.schema.createTable('transactions', (table) => {
        table.increments();
        table.string('hash');
        table.string('error');
        table.timestamp('created_at').notNullable();
        table.json('message').notNullable();
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('transactions');
};
