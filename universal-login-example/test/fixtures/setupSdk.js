import {RelayerUnderTest} from 'universal-login-relayer/build';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {getKnexConfig} from '../../src/relayer/utils';


export default async function setupSdk(givenProvider = createMockProvider()) {
  const relayer = await RelayerUnderTest.createPreconfigured(givenProvider, getKnexConfig());
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
