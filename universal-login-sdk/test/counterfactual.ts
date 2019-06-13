import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversaLoginSDK from '../lib/sdk';

describe('SDK counterfactual', () => {
  let provider: providers.Provider;
  let sdk: UniversaLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(wallet);
    await relayer.start();
    sdk = new UniversaLoginSDK(relayer.url(), provider);
  });

  it('wo9rks', async () => {
    console.log(await sdk.create('dupa.mylogin.eth'));
  });

  after(async () => {
    await relayer.stop();
  });
});
