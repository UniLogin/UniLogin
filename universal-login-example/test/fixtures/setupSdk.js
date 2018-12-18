import {RelayerUnderTest} from 'universal-login-relayer/build';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';

export default async function setupSdk(provider = createMockProvider()) {
  const relayer = await RelayerUnderTest.createPreconfigured(provider);
  await relayer.start();
  ({provider} = relayer)
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider}
}
