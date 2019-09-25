import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, providers, Contract} from 'ethers';
import {deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {TokenDetailsWithBalance, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil, BalanceChecker, TokenDetails, normalizeBigNumber} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import {TokensDetailsStore} from '../../../lib/core/services/TokensDetailsStore';

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
        ETHER_NATIVE_TOKEN,
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token'}
      ];

      balanceChecker = new BalanceChecker(provider);
      balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, {tokensDetails: supportedTokens} as TokensDetailsStore, 100);
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
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: utils.parseEther('0')}
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.firstCall);
      unsubscribe();

      expect(callback).to.have.been.calledOnce;
      const actualtokenBalances = callback.firstCall.args[0] as TokenDetailsWithBalance[];
      actualtokenBalances[0].balance = normalizeBigNumber(actualtokenBalances[0].balance);
      expect(callback.firstCall.args[0]).to.deep.equal(expectedTokenBalances);
    });

    it('1 subscription - change balance', async () => {
      const callback = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0.5')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: normalizeBigNumber(utils.bigNumberify('0'))}
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.firstCall);
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await waitUntil(() => !!callback.secondCall);
      unsubscribe();

      const actualTokenBalancesAfterTransaction = callback.secondCall.args[0];
      actualTokenBalancesAfterTransaction[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction[0].balance);
      expect(actualTokenBalancesAfterTransaction).to.deep.eq(expectedTokenBalancesAfterTransaction);
      expect(callback).to.have.been.calledTwice;
    });

    it('2 subscriptions - no change', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalances = [
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: utils.parseEther('0')}
      ];

      const unsubscribe1 = balanceObserver.subscribe(callback1);
      await waitUntil(() => !!callback1.firstCall);

      const unsubscribe2 = balanceObserver.subscribe(callback2);
      await waitUntil(() => !!callback2.firstCall);

      unsubscribe1();
      unsubscribe2();

      const actualTokenBalances1 = callback1.firstCall.args[0];
      actualTokenBalances1[0].balance = normalizeBigNumber(actualTokenBalances1[0].balance);
      expect(actualTokenBalances1).to.deep.equal(expectedTokenBalances);
      expect(callback1).to.have.been.calledOnce;

      const actualTokenBalances2 = callback2.firstCall.args[0];
      actualTokenBalances2[0].balance = normalizeBigNumber(actualTokenBalances2[0].balance);
      expect(actualTokenBalances2).to.deep.equal(expectedTokenBalances);
      expect(callback2).to.have.been.calledOnce;
    });


    it('2 subscriptions - change balance', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0.5')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: utils.parseEther('0')}
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

      const actualTokenBalancesAfterTransaction1 = callback1.secondCall.args[0];
      actualTokenBalancesAfterTransaction1[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction1[0].balance);
      expect(actualTokenBalancesAfterTransaction1).to.deep.equal(expectedTokenBalancesAfterTransaction);
      expect(callback1).to.have.been.calledTwice;

      const actualTokenBalancesAfterTransaction2 = callback2.secondCall.args[0];
      actualTokenBalancesAfterTransaction2[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction2[0].balance);
      expect(actualTokenBalancesAfterTransaction2).to.deep.equal(expectedTokenBalancesAfterTransaction);
      expect(callback2).to.have.been.calledTwice;
    });

    afterEach(async () => {
      await balanceObserver.stop();
    });
  });
});
