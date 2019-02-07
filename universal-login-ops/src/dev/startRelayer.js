const TokenGrantingRelayer = require('./TokenGrantingRelayer');

async function startRelayer(configuration, database, wallet) {
  const relayer = new TokenGrantingRelayer(configuration, database, wallet.provider);
  console.log('Migrating database...');
  await relayer.database.migrate.latest();
  relayer.start();
  console.log(`Relayer started on port ${configuration.port}...`);
  return relayer;
}

module.exports = startRelayer;
