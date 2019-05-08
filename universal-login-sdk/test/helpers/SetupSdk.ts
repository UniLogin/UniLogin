import {RelayerUnderTest} from '@universal-login/relayer';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import UniversalLoginSDK from '@universal-login/sdk';
import {providers} from 'ethers';

declare interface SetupSdkOverrides {
  givenProvider?: providers.Web3Provider;
  overridePort?: string;
}

export async function setupSdk({givenProvider = createMockProvider(), overridePort = '33111'}: SetupSdkOverrides = {}) {
  const [deployer] = getWallets(givenProvider);
  const relayer = await RelayerUnderTest.createPreconfigured(deployer, overridePort);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
