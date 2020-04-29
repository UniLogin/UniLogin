exports.up = async (knex) => {
  await knex.schema.table('deployments', (table) => {
    table.renameColumn('usedGasPrice', 'gasPriceUsed');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('deployments', (table) => {
    table.renameColumn('gasPriceUsed', 'usedGasPrice');
  });
};
