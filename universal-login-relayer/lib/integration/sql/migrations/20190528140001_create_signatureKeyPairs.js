/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.createTable('signature_key_pairs', (table) => {
      table.increments();
      table.string('messageHash').notNullable();
      table.string('signature').notNullable();
      table.string('key').notNullable();

      table.foreign('messageHash').references('messageHash').inTable('messages');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('signature_key_pairs');
};
