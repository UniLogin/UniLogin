import {RelayerUnderTest} from 'universal-login-relayer/lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {providers} from 'ethers';

declare interface SetupSdkOverrides {
  givenProvider?: providers.Provider;
  overridePort?: number;
}

export async function setupSdk({givenProvider = createMockProvider(), overridePort = 33111}: SetupSdkOverrides) {
  const relayer = await RelayerUnderTest.createPreconfigured({provider: givenProvider, overridePort});
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
