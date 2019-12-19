import {Wallet} from 'ethers';
import {TEST_SDK_CONFIG} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../src/api/sdk';

export async function setupSdk(deployer: Wallet, overridePort = '33111') {
  const {relayer} = await RelayerUnderTest.createPreconfigured(deployer, overridePort);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider, TEST_SDK_CONFIG);
  await sdk.fetchRelayerConfig();
  return {sdk, relayer, provider};
}
