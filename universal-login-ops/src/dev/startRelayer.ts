import {DevelopmentRelayer, RelayerClass} from '@universal-login/relayer';
import {providers} from 'ethers';


export async function startDevelopmentRelayer(
  configuration: any,
  provider: providers.Provider,
  relayerConstructor: RelayerClass = DevelopmentRelayer
) {
  const relayer = new relayerConstructor(configuration, provider)
  await relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}
