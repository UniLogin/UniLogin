import Relayer, {DevelopmentRelayer} from 'universal-login-relayer';
import {providers} from 'ethers';

export type RelayerConstructor = {
  new (config: any, provider: providers.Provider): DevelopmentRelayer | Relayer;
}

export async function startDevelopmentRelayer(
  configuration: any,
  provider: providers.Provider,
  relayerConstructor: RelayerConstructor = DevelopmentRelayer
) {
  const relayer = new relayerConstructor(configuration, provider)
  await relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}
