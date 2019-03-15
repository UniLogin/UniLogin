import {RelayerUnderTest} from 'universal-login-relayer/lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {providers} from 'ethers';

declare interface SetupSdkOverrides {
  givenProvider?: providers.Provider;
  overridePort?: number;
}

export async function setupSdk({givenProvider, overridePort}: SetupSdkOverrides = {overridePort: 33111, givenProvider: createMockProvider()}) {
  const relayer = await RelayerUnderTest.createPreconfigured(givenProvider, {overridePort});
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
