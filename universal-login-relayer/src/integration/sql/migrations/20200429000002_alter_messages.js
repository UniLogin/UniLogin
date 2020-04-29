exports.up = async (knex) => {
  await knex.schema.table('messages', (table) => {
    table.renameColumn('usedGasPrice', 'gasPriceUsed');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('messages', (table) => {
    table.renameColumn('gasPriceUsed', 'usedGasPrice');
  });
};