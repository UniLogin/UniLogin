const TokenGrantingRelayer = require('./TokenGrantingRelayer');

async function startRelayer(configuration, database, wallet) {
  const relayer = new TokenGrantingRelayer(configuration, database, wallet.provider);
  console.log('Migrating database...');
  await relayer.database.migrate.latest();
  console.log(`Starting relayer on port ${configuration.port}...`);
  relayer.start();
  return relayer;
}

module.exports = startRelayer;
