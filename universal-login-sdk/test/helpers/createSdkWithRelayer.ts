import {Wallet} from 'ethers';
import {TEST_SDK_CONFIG} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../src';

export const createSdkWithRelayer = async (deployer: Wallet) => {
  const {relayer} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  const sdk = new UniversalLoginSDK(relayer.url(), deployer.provider, TEST_SDK_CONFIG);
  await sdk.fetchRelayerConfig();
  return {sdk, relayer};
};
