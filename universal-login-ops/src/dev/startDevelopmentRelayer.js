const DevelopmentRelayer = require('./developmentRelayer');

async function startDevelopmentRelayer(configuration, database, wallet) {
  const relayer = new DevelopmentRelayer(configuration, database, wallet.provider);
  console.log('Migrating database...');
  await relayer.database.migrate.latest();
  relayer.start();
  console.log(`Relayer started on port ${configuration.port}...`);
  return relayer;
}

module.exports = startDevelopmentRelayer;
