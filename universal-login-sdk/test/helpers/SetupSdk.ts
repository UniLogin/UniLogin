import {RelayerUnderTest} from 'universal-login-relayer/lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {providers} from 'ethers';

export async function setupSdk(givenProvider: providers.Provider = createMockProvider()) {
  const relayer = await RelayerUnderTest.createPreconfigured(givenProvider);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
