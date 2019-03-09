import DevelopmentRelayer from './DevelopmentRelayer';

async function startDevelopmentRelayer(configuration, wallet) {
  const relayer = new DevelopmentRelayer(configuration, wallet.provider);
  relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}

module.exports = startDevelopmentRelayer;
