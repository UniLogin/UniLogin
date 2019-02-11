import DevelopmentRelayer from './DevelopmentRelayer';

async function startDevelopmentRelayer(configuration, wallet) {
  const relayer = new DevelopmentRelayer(configuration, wallet.provider);
  relayer.start();
  console.log(`Relayer started on port ${configuration.port}...`);
  return relayer;
}

module.exports = startDevelopmentRelayer;
