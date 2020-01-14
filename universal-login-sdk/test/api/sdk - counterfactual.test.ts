import chai, {expect} from 'chai';
import {providers, Wallet, utils} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, getDeployedBytecode, TEST_ACCOUNT_ADDRESS, TEST_GAS_PRICE, DEFAULT_GAS_LIMIT, TEST_SDK_CONFIG} from '@universal-login/commons';
import {emptyMessage} from '@universal-login/contracts/testutils';
import {beta2} from '@universal-login/contracts';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../src/api/sdk';

chai.use(solidity);

describe('INT: SDK counterfactual deployment', () => {
  let provider: providers.Provider;
  let sdk: UniversalLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;
  const ensName = 'name.mylogin.eth';

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, provider} = await RelayerUnderTest.createPreconfigured(wallet));
    await relayer.start();
    sdk = new UniversalLoginSDK(relayer.url(), provider, TEST_SDK_CONFIG);
    await sdk.fetchRelayerConfig();
  });

  it('createFutureWallet returns private key and contract address', async () => {
    const {privateKey, contractAddress} = await sdk.createFutureWallet(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(privateKey).to.be.properPrivateKey;
    expect(contractAddress).to.be.properAddress;
  });

  it('waitForBalance returns promise, which resolves when balance update', async () => {
    const {waitForBalance, contractAddress} = (await sdk.createFutureWallet(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('should not deploy contract which does not have balance', async () => {
    const {deploy} = (await sdk.createFutureWallet(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    const {waitToBeSuccess} = await deploy();
    await expect(waitToBeSuccess()).to.be.eventually.rejected;
  });

  it('counterfactual deployment roundtrip', async () => {
    const {deploy, contractAddress, waitForBalance, privateKey} = (await sdk.createFutureWallet(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await waitForBalance();
    const {waitToBeSuccess} = await deploy();
    const deployedWallet = await waitToBeSuccess();
    expect(deployedWallet.contractAddress).to.be.eq(contractAddress);
    expect(await provider.getCode(contractAddress)).to.be.eq(`0x${getDeployedBytecode(beta2.WalletProxy)}`);
    const message = {...emptyMessage, from: contractAddress, to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1'), gasLimit: DEFAULT_GAS_LIMIT};
    await expect(sdk.execute(message, privateKey)).to.be.fulfilled;
    await expect(deploy()).to.be.rejected;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
