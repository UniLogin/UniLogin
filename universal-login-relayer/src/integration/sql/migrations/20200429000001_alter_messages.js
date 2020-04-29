/*
  THIS IS A MIGRATION
  This file SHOULD NOT be RENAMED or CHANGED in ANY WAY!
  If you need to change the database schema create a new migration.
*/

exports.up = async (knex) => {
  await knex.schema.table('messages', (table) => {
    table.string('usedGasPrice', 64);
    table.string('gasUsed', 64);
    table.boolean('isPaid').notNullable().defaultTo(false);
    table.integer('refundPayerId');

    table.foreign('refundPayerId').references('id').inTable('refund_payers');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('messages', (table) => {
    table.dropColumns(['usedGasPrice', 'gasUsed', 'refundPayerId', 'isPaid']);
  });
};
