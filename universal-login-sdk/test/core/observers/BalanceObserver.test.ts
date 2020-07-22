import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {TokenDetailsWithBalance, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil, BalanceChecker, TokenDetails, normalizeBigNumber, ProviderService} from '@unilogin/commons';
import {mockContracts} from '@unilogin/contracts/testutils';
import {BalanceObserver} from '../../../src/core/observers/BalanceObserver';
import {TokensDetailsStore} from '../../../src/core/services/TokensDetailsStore';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';

chai.use(sinonChai);

describe('INT: BalanceObserver', () => {
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let provider: MockProvider;
  let wallet: Wallet;
  let mockToken: Contract;

  describe('BalanceObserver', () => {
    beforeEach(async () => {
      provider = new MockProvider();
      provider.pollingInterval = 10;
      [wallet] = provider.getWallets();
      mockToken = await deployContract(wallet, mockContracts.MockToken);
      const supportedTokens: TokenDetails[] = [
        ETHER_NATIVE_TOKEN,
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', decimals: 18},
      ];

      const providerService = new ProviderService(provider);
      const blockNumberState = new BlockNumberState(providerService);
      balanceChecker = new BalanceChecker(providerService);
      balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, {tokensDetails: supportedTokens} as TokensDetailsStore, blockNumberState, providerService);
    });

    it('getBalances', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.3'));

      const balances = await balanceObserver.getBalances();

      expect(balances).to.be.lengthOf(2);
      expect(balances[0].balance).to.eq(utils.parseEther('0.5'));
      expect(balances[1].balance).to.eq(utils.parseEther('0.3'));
    });

    it('1 subscription - no change', async () => {
      const callback = sinon.spy();
      const expectedTokenBalances = [
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: normalizeBigNumber(utils.parseEther('0')), decimals: 18},
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.secondCall);
      unsubscribe();

      expect(callback).to.have.been.calledTwice;
      const actualtokenBalances = callback.secondCall.args[0] as TokenDetailsWithBalance[];
      actualtokenBalances[0].balance = normalizeBigNumber(actualtokenBalances[0].balance);
      expect(callback.secondCall.args[0]).to.deep.eq(expectedTokenBalances);
    });

    it('1 subscription - change balance', async () => {
      const callback = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {...ETHER_NATIVE_TOKEN, balance: normalizeBigNumber(utils.parseEther('0.5'))},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: normalizeBigNumber(utils.bigNumberify('0')), decimals: 18},
      ];

      const unsubscribe = balanceObserver.subscribe(callback);
      await waitUntil(() => !!callback.secondCall);
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await waitUntil(() => !!callback.thirdCall);
      unsubscribe();

      const actualTokenBalancesAfterTransaction = callback.thirdCall.args[0];
      actualTokenBalancesAfterTransaction[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction[0].balance);
      expect(actualTokenBalancesAfterTransaction).to.deep.eq(expectedTokenBalancesAfterTransaction);
      expect(callback).to.have.been.calledThrice;
      expect((balanceObserver as any).lastTokenBalances).to.deep.eq([]);
    });

    it('2 subscriptions - no change', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalances = [
        {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('0')},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: utils.parseEther('0'), decimals: 18},
      ];

      const unsubscribe1 = balanceObserver.subscribe(callback1);
      await waitUntil(() => !!callback1.secondCall);

      const unsubscribe2 = balanceObserver.subscribe(callback2);
      await waitUntil(() => !!callback2.firstCall);

      unsubscribe1();
      unsubscribe2();

      const actualTokenBalances1 = callback1.secondCall.args[0];
      actualTokenBalances1[0].balance = normalizeBigNumber(actualTokenBalances1[0].balance);
      expect(actualTokenBalances1).to.deep.eq(expectedTokenBalances);
      expect(callback1).to.have.been.calledTwice;
      const actualTokenBalances2 = callback2.firstCall.args[0];
      actualTokenBalances2[0].balance = normalizeBigNumber(actualTokenBalances2[0].balance);
      expect(actualTokenBalances2).to.deep.eq(expectedTokenBalances);
      expect(callback2).to.have.been.calledOnce;
      expect((balanceObserver as any).lastTokenBalances).to.deep.eq([]);
    });

    it('2 subscriptions - change balance', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      const expectedTokenBalancesAfterTransaction = [
        {...ETHER_NATIVE_TOKEN, balance: normalizeBigNumber(utils.parseEther('0.5'))},
        {address: mockToken.address, symbol: 'MCK', name: 'Mock Token', balance: utils.parseEther('0'), decimals: 18},
      ];

      const unsubscribe1 = balanceObserver.subscribe(callback1);
      const unsubscribe2 = balanceObserver.subscribe(callback2);

      await waitUntil(() => !!callback1.secondCall);
      await waitUntil(() => !!callback2.secondCall);

      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
      await waitUntil(() => !!callback1.thirdCall);
      await waitUntil(() => !!callback2.thirdCall);

      unsubscribe1();
      unsubscribe2();

      const actualTokenBalancesAfterTransaction1 = callback1.thirdCall.args[0];
      actualTokenBalancesAfterTransaction1[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction1[0].balance);
      expect(actualTokenBalancesAfterTransaction1).to.deep.eq(expectedTokenBalancesAfterTransaction);
      expect(callback1).to.have.been.calledThrice;

      const actualTokenBalancesAfterTransaction2 = callback2.thirdCall.args[0];
      actualTokenBalancesAfterTransaction2[0].balance = normalizeBigNumber(actualTokenBalancesAfterTransaction2[0].balance);
      expect(actualTokenBalancesAfterTransaction2).to.deep.eq(expectedTokenBalancesAfterTransaction);
      expect(callback2).to.have.been.calledThrice;
      expect((balanceObserver as any).lastTokenBalances).to.deep.eq([]);
    });
  });
});
