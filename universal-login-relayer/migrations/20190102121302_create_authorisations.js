
exports.up = async (knex) => {
  await knex.schema.createTable('authorisations', (table) => {
    table.increments();
    table.string('walletContractAddress').notNullable();
    table.string('key').notNullable();
    table.json('deviceInfo');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('authorisations');
};
