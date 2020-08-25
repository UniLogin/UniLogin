import {ETHER_NATIVE_TOKEN, SerializableFutureWallet, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_GAS_PRICE, DEPLOY_GAS_LIMIT, BalanceChecker, ProviderService} from '@unilogin/commons';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {utils, Wallet} from 'ethers';
import UniLoginSdk, {FutureWallet} from '../../../src';
import {ENSService} from '../../../src/integration/ethereum/ENSService';
import {AddressZero} from 'ethers/constants';

describe('UNIT: FutureWallet', () => {
  const serializableFutureWallet: SerializableFutureWallet = {
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    ensName: 'name.mylogin.eth',
    gasPrice: TEST_GAS_PRICE,
    gasToken: ETHER_NATIVE_TOKEN.address,
    email: 'name@gmail.com',
  };
  const minimalAmount = utils.parseEther('0.5').toString();
  let provider: MockProvider;
  let wallet: Wallet;
  let futureWallet: FutureWallet;
  let mockSDK: UniLoginSdk;

  before(() => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    mockSDK = {
      provider: provider,
    } as any;
    futureWallet = new FutureWallet(serializableFutureWallet, mockSDK, {} as ENSService, TEST_CONTRACT_ADDRESS, AddressZero, new BalanceChecker(new ProviderService(provider)));
  });

  it('waits for Balance', async () => {
    const to = serializableFutureWallet.contractAddress;
    await wallet.sendTransaction({to, value: utils.parseEther('2')});
    const result = await futureWallet.waitForBalance();
    expect(await provider.getBalance(to)).to.be.above(minimalAmount);
    expect(result).be.eq(to);
  });

  it('returns minimal amount to deploy', () => {
    const expectedMinimalAmount = utils.formatEther(utils.bigNumberify(TEST_GAS_PRICE).mul(DEPLOY_GAS_LIMIT));
    expect(futureWallet.getMinimalAmount()).to.eq(expectedMinimalAmount);
  });
});
