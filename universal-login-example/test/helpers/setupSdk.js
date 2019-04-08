import {RelayerUnderTest} from '@universal-login/relayer/build/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from '@universal-login/sdk';


export default async function setupSdk(givenProvider = createMockProvider()) {
  const relayer = await RelayerUnderTest.createPreconfigured({provider: givenProvider, overridePort: 33112});
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
