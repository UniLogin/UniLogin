import {DevelopmentRelayer, RelayerClass} from '@universal-login/relayer';
import {providers, utils} from 'ethers';

export const withENS = (provider : providers.JsonRpcProvider, ensAddress : string) => {
  const chainOptions = {name: 'ganache', ensAddress, chainId: 0} as utils.Network;
  return new providers.JsonRpcProvider(provider.connection.url, chainOptions);
};


export async function startDevelopmentRelayer(
  configuration: any,
  provider: providers.JsonRpcProvider,
  relayerConstructor: RelayerClass = DevelopmentRelayer
) {
  const providerWithENS = withENS(provider, configuration.chainSpec.ensAddress);
  const relayer = new relayerConstructor(configuration, providerWithENS);
  await relayer.start();
  console.log(`         Relayer url: http://localhost:${configuration.port}`);
  return relayer;
}
