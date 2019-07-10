import chai, {expect} from 'chai';
import {providers, Wallet, utils} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, getDeployedBytecode, createSignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import UniversaLoginSDK from '../../lib/sdk';

chai.use(solidity);

describe('SDK counterfactual', () => {
  let provider: providers.Provider;
  let sdk: UniversaLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, provider} = await RelayerUnderTest.createPreconfigured(wallet));
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

  it('should not deploy contract which does not have balance', async () => {
    const {deploy} = (await sdk.createFutureWallet());
    await expect(deploy('login.mylogin.eth', '1')).to.be.rejected;
  });

  it('counterfactual deployment roundtrip', async () => {
    const ensName = 'name.mylogin.eth';
    const {deploy, contractAddress, waitForBalance, privateKey} = (await sdk.createFutureWallet());
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await waitForBalance();
    const deployedContractAddress = await deploy(ensName, '1');
    expect(deployedContractAddress).to.be.eq(contractAddress);
    expect(await provider.getCode(contractAddress)).to.be.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
    const signedMessage = await createSignedMessage({from: contractAddress, to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1')}, privateKey);
    await expect(sdk.execute(signedMessage, privateKey)).to.be.fulfilled;
    await expect(deploy(ensName, '1')).to.be.rejected;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
