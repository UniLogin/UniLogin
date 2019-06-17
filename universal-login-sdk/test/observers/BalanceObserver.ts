import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, providers, Contract} from 'ethers';
import {deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, sleep, waitUntil} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {BalanceObserver} from '../../lib/observers/BalanceObserver';

describe('SDK: BalanceObserver', () => {
  let balanceObserver: BalanceObserver;
  let provider: providers.Provider;
  let wallet: Wallet;
  let mockToken: Contract;
  const minimalAmount =  utils.parseEther('0.5').toString();
  let supportedTokens = [
    {
      address: ETHER_NATIVE_TOKEN.address,
      minimalAmount
    }
  ];
  let callback: sinon.SinonSpy;


  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, MockToken);
    supportedTokens = [...supportedTokens, {address: mockToken.address, minimalAmount}];
    balanceObserver = new BalanceObserver(supportedTokens, provider);
    balanceObserver.step = 10;
    balanceObserver.start();
    callback = sinon.spy();
  });

  it('calls callback if ether balance changed', async () => {
    const unsubscribe = balanceObserver.subscribeBalanceChanged(TEST_ACCOUNT_ADDRESS, callback);
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1.0')});
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledWith({tokenAddress: ETHER_NATIVE_TOKEN.address, contractAddress: TEST_ACCOUNT_ADDRESS});
    unsubscribe();
  });

  it('calls callback if token balance changed', async () => {
    const unsubscribe = balanceObserver.subscribeBalanceChanged(TEST_ACCOUNT_ADDRESS, callback);
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('1.0'));
    await waitUntil(() => !!callback.firstCall);

    expect(callback).to.have.been.calledWith({tokenAddress: mockToken.address, contractAddress: TEST_ACCOUNT_ADDRESS});
    unsubscribe();
  });

  it('shouldn`t call callback if token balance is smaller than minimalAmount', async () => {
    const unsubscribe = balanceObserver.subscribeBalanceChanged(TEST_ACCOUNT_ADDRESS, callback);
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.49'));
    await sleep(50);
    expect(callback).to.not.have.been.called;
    unsubscribe();
  });

  it('should throw error if is already started', () => {
    expect(balanceObserver.start()).to.be.rejectedWith('Other wallet waiting for counterfactual deployment. Stop BalanceObserver to cancel old wallet instantialisation.');
  });

  afterEach(async () => {
    await balanceObserver.finalizeAndStop();
  });
});
