import Relayer, {DevelopmentRelayer} from 'universal-login-relayer';

async function startDevelopmentRelayer(configuration, wallet, basicRelayer) {
  let relayer;
  if(basicRelayer) {
    relayer = new Relayer(configuration, wallet.provider);
  } else {
    relayer = new DevelopmentRelayer(configuration, wallet.provider);
  }
  await relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}

export {startDevelopmentRelayer};
