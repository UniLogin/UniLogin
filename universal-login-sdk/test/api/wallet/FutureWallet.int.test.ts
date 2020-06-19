import chai, {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {solidity, MockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, getDeployedBytecode, TEST_ACCOUNT_ADDRESS, TEST_GAS_PRICE, DEFAULT_GAS_LIMIT, TEST_SDK_CONFIG} from '@unilogin/commons';
import {emptyMessage} from '@unilogin/contracts/testutils';
import {gnosisSafe} from '@unilogin/contracts';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSdk from '../../../src/api/sdk';
import {FutureWalletFactory} from '../../../src/api/FutureWalletFactory';

chai.use(solidity);

describe('INT: FutureWallet', () => {
  let provider: MockProvider;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;
  const ensName = 'name.mylogin.eth';
  let futureWalletFactory: FutureWalletFactory;

  beforeEach(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    ({relayer} = await RelayerUnderTest.createPreconfigured(wallet));
    await relayer.start();
    const sdk = new UniLoginSdk(relayer.url(), provider, TEST_SDK_CONFIG);
    await sdk.fetchRelayerConfig();
    futureWalletFactory = sdk.getFutureWalletFactory();
  });

  it('createNew returns proper FutureWallet', async () => {
    const futureWallet = await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(futureWallet.privateKey).to.be.properPrivateKey;
    expect(futureWallet.contractAddress).to.be.properAddress;
    expect(futureWallet.gasPrice).to.eq(TEST_GAS_PRICE);
    expect(futureWallet.gasToken).to.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('waitForBalance returns promise, which resolves when balance update', async () => {
    const futureWallet = await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    await wallet.sendTransaction({to: futureWallet.contractAddress, value: utils.parseEther('2')});
    const result = await futureWallet.waitForBalance();
    expect(result).be.eq(futureWallet.contractAddress);
  });

  it('should not deploy contract which does not have balance', async () => {
    const futureWallet = await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    const {waitToBeSuccess} = await futureWallet.deploy();
    await expect(waitToBeSuccess()).to.be.eventually.rejected;
  });

  it('counterfactual deployment roundtrip', async () => {
    const futureWallet = await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    await wallet.sendTransaction({to: futureWallet.contractAddress, value: utils.parseEther('2')});
    await futureWallet.waitForBalance();
    const {waitToBeSuccess} = await futureWallet.deploy();
    const deployedWallet = await waitToBeSuccess();
    expect(deployedWallet.contractAddress).to.eq(futureWallet.contractAddress);
    expect(await provider.getCode(futureWallet.contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy)}`);
    const message = {...emptyMessage, from: futureWallet.contractAddress, to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1'), gasLimit: DEFAULT_GAS_LIMIT};
    await expect(deployedWallet.execute(message)).to.be.fulfilled;
    await expect(futureWallet.deploy()).to.be.rejected;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
