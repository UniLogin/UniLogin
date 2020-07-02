import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, sleep, waitUntil, BalanceChecker, ProviderService} from '@unilogin/commons';
import {mockContracts} from '@unilogin/contracts/testutils';
import {DeploymentReadyObserver} from '../../../src/core/observers/DeploymentReadyObserver';

describe('INT: DeploymentReadyObserver', () => {
  let deploymentReadyObserver: DeploymentReadyObserver;
  let provider: MockProvider;
  let wallet: Wallet;
  let mockToken: Contract;
  const minimalAmount = '0.5';
  let callback: sinon.SinonSpy;
  let unsubscribe: any;
  let balanceChecker: BalanceChecker;

  beforeEach(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    callback = sinon.spy();
    balanceChecker = new BalanceChecker(new ProviderService(provider));
  });

  describe('ether', () => {
    beforeEach(() => {
      deploymentReadyObserver = new DeploymentReadyObserver(ETHER_NATIVE_TOKEN.address, minimalAmount, balanceChecker);
      deploymentReadyObserver.tick = 1;
      unsubscribe = deploymentReadyObserver.startAndSubscribe(TEST_ACCOUNT_ADDRESS, callback);
    });

    it('calls callback if ether balance changed', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1.0')});
      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledWith(TEST_ACCOUNT_ADDRESS);
    });

    it('shouldn`t call callback if ether balance is smaller than minimalAmount', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.49')});
      await sleep(50);
      expect(callback).to.not.have.been.called;
    });

    it('should throw error if is already started', () => {
      expect(() => deploymentReadyObserver.startAndSubscribe(TEST_ACCOUNT_ADDRESS, callback))
        .throws('Other wallet waiting for counterfactual deployment. Stop observer to cancel old wallet instantialisation.');
    });
  });

  describe('token', () => {
    beforeEach(async () => {
      mockToken = await deployContract(wallet, mockContracts.MockToken);
      deploymentReadyObserver = new DeploymentReadyObserver(mockToken.address, minimalAmount, balanceChecker);
      deploymentReadyObserver.tick = 1;
      unsubscribe = deploymentReadyObserver.startAndSubscribe(TEST_ACCOUNT_ADDRESS, callback);
    });

    it('calls callback if token balance changed', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('1.0'));
      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledWith(TEST_ACCOUNT_ADDRESS);
    });

    it('shouldn`t call callback if token balance is smaller than minimalAmount', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.49'));
      await sleep(50);
      expect(callback).to.not.have.been.called;
    });
  });

  afterEach(async () => {
    unsubscribe();
    await deploymentReadyObserver.finalizeAndStop();
  });
});
