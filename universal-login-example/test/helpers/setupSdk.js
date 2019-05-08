import {RelayerUnderTest} from '@universal-login/relayer';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import UniversalLoginSDK from '@universal-login/sdk';


export default async function setupSdk(givenProvider = createMockProvider()) {
  const [wallet] = getWallets(givenProvider);
  const relayer = await RelayerUnderTest.createPreconfigured(wallet, 33112);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
