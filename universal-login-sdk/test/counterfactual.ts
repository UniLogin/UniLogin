import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversaLoginSDK from '../lib/sdk';

chai.use(solidity);


describe('SDK counterfactual', () => {
  let provider: providers.Provider;
  let sdk: UniversaLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer} = await RelayerUnderTest.createPreconfigured(wallet));
    await relayer.start();
    sdk = new UniversaLoginSDK(relayer.url(), provider);
  });

  it('getFutureWallet returns private key and contract address', async () => {
    const [privateKey, futureContractAddress] = (await sdk.getFutureWallet());
    expect(privateKey).to.be.properPrivateKey;
    expect(futureContractAddress).to.be.properAddress;
  });

  after(async () => {
    await relayer.stop();
  });
});
