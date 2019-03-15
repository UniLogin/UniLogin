import {DevelopmentRelayer} from 'universal-login-relayer';

async function startDevelopmentRelayer(configuration, wallet) {
  const relayer = new DevelopmentRelayer(configuration, wallet.provider);
  await relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}

export {startDevelopmentRelayer};
