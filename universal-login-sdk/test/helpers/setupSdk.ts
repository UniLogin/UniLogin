import {Wallet} from 'ethers';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../lib/api/sdk';
import {setupSdkTicks} from './setupSdkTicks';


export async function setupSdk(deployer: Wallet, overridePort = '33111') {
  const {relayer} = await RelayerUnderTest.createPreconfigured(deployer, overridePort);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  setupSdkTicks(sdk);
  return {sdk, relayer, provider};
}
