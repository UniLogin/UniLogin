import chai, {expect} from 'chai';
import {providers, Wallet, utils} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversaLoginSDK from '../lib/sdk';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

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

  it('createFutureWallet returns private key and contract address', async () => {
    const {privateKey, contractAddress} = await sdk.createFutureWallet();
    expect(privateKey).to.be.properPrivateKey;
    expect(contractAddress).to.be.properAddress;
  });

  it('waitForBalance returns promise, which resolves when balance update', async () => {
    const {waitForBalance, contractAddress} = (await sdk.createFutureWallet());
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('should deploy contract with future address', async () => {
    const {deploy, contractAddress, waitForBalance} = (await sdk.createFutureWallet());
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await waitForBalance();
    const deployedContractAddress = await deploy('name.mylogin.eth');
    expect(deployedContractAddress).to.be.eq(contractAddress);
  });

  it('should not deploy contract which does not have balance', async () => {
    const {deploy} = (await sdk.createFutureWallet());
    await expect(deploy('login.mylogin.eth')).to.be.rejected;
  });

  after(async () => {
    await relayer.stop();
  });
});
