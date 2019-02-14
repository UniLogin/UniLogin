import DevelopmentRelayer from './DevelopmentRelayer';

async function startDevelopmentRelayer(configuration, database, wallet) {
  const relayer = new DevelopmentRelayer(configuration, database, wallet.provider);
  relayer.start();
  console.log(`Relayer started on port ${configuration.port}...`);
  return relayer;
}

module.exports = startDevelopmentRelayer;
