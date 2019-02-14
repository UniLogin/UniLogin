import RelayerUnderTest from 'universal-login-relayer/build/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {PostgreDB} from 'universal-login-relayer/build/utils/postgreDB';


export default async function setupSdk(givenProvider = createMockProvider()) {
  const database = new PostgreDB();
  const relayer = await RelayerUnderTest.createPreconfigured(database, givenProvider);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
