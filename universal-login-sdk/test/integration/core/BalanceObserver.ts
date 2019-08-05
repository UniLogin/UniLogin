import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, providers, Contract} from 'ethers';
import {deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil, BalanceChecker, TokenDetails} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';

describe('INT: BalanceObserver', () => {
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let provider: providers.Provider;
  let wallet: Wallet;
  let mockToken: Contract;

  describe('BalanceObserver', () => {
    beforeEach(async () => {
      provider = createMockProvider();
      [wallet] = getWallets(provider);
      mockToken = await deployContract(wallet, MockToken);
      const supportedTokens: TokenDetails[] = [
        {address: ETHER_NATIVE_TOKEN.address, symbol: 'ETH', name: 'Ethereum'},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}
      ];

      balanceChecker = new BalanceChecker(provider);
      balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, supportedTokens);
      balanceObserver.step = 100;
    });

    it('getBalances', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.3'));

      const balances = await balanceObserver.getBalances();

      expect(balances).to.be.lengthOf(2);
      expect(balances[0].balance).to.equal(utils.parseEther('0.5'));
      expect(balances[1].balance).to.equal(utils.parseEther('0.3'));
    });

    it('1 subscription - no change', async () => {
      const callback = sinon.spy();
      const expectedTokenBalances = [
        {token: {address: ETHER_NATIVE_TOKEN.address, symbol: 'ETH', name: 'Ethereum'}, balance: '0'},
        {token: {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}, balance: '0'}
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.firstCall);
      unsubscribe();

      expect(callback).to.have.been.calledOnce;
      expect(callback).to.have.been.calledWith(expectedTokenBalances);
    });

    it('1 subscription - change balance', async () => {
      const callback = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {token: {address: ETHER_NATIVE_TOKEN.address, symbol: 'ETH', name: 'Ethereum'}, balance: '500000000000000000'},
        {token: {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}, balance: '0'}
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.firstCall);
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await waitUntil(() => !!callback.secondCall);
      unsubscribe();

      const actualTokenBalancesAfterTransaction = callback.secondCall.args[0];
      expect(actualTokenBalancesAfterTransaction).to.deep.equal(expectedTokenBalancesAfterTransaction);
    });

    it('2 subscriptions - no change', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalances = [
        {token: {address: ETHER_NATIVE_TOKEN.address, symbol: 'ETH', name: 'Ethereum'}, balance: '0'},
        {token: {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}, balance: '0'}
      ];

      const unsubscribe1 = balanceObserver.subscribe(callback1);
      await waitUntil(() => !!callback1.firstCall);

      const unsubscribe2 = balanceObserver.subscribe(callback2);
      await waitUntil(() => !!callback2.firstCall);

      unsubscribe1();
      unsubscribe2();

      expect(callback1).to.have.been.calledOnce;
      expect(callback1).to.have.been.calledWith(expectedTokenBalances);
      expect(callback2).to.have.been.calledOnce;
      expect(callback2).to.have.been.calledWith(expectedTokenBalances);
    });


    it('2 subscriptions - change balance', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {token: {address: ETHER_NATIVE_TOKEN.address, symbol: 'ETH', name: 'Ethereum'}, balance: '500000000000000000'},
        {token: {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}, balance: '0'}
      ];

      const unsubscribe1 = balanceObserver.subscribe(callback1);
      await waitUntil(() => !!callback1.firstCall);

      const unsubscribe2 = balanceObserver.subscribe(callback2);
      await waitUntil(() => !!callback2.firstCall);

      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await waitUntil(() => !!callback1.secondCall);
      await waitUntil(() => !!callback2.secondCall);

      unsubscribe1();
      unsubscribe2();

      expect(callback1).to.have.been.calledTwice;
      expect(callback2).to.have.been.calledTwice;
      expect(callback1).to.have.been.calledWith(expectedTokenBalancesAfterTransaction);
      expect(callback2).to.have.been.calledWith(expectedTokenBalancesAfterTransaction);
    });

    afterEach(async () => {
      await balanceObserver.stop();
    });
  });
});
