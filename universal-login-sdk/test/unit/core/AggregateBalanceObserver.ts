import {expect} from 'chai';
import {utils} from 'ethers';
import {TokenDetailsWithBalance, ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import {PriceObserver} from '../../../lib/core/observers/PriceObserver';

describe('UNIT: AggregateBalanceObserver', () => {
  const mockedAggregateBalanceObserver = new AggregateBalanceObserver({} as BalanceObserver, {} as PriceObserver);
  mockedAggregateBalanceObserver.notifyListeners = () => {};

  const tokenDetailsWithBalance: TokenDetailsWithBalance[] = [
    {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('1')},
    {address: TEST_CONTRACT_ADDRESS, symbol: 'Mock', name: 'MockToken', balance: utils.parseEther('2')}
  ];
  const tokenPrices = {
    ETH: {USD: 218.21, EUR: 194.38, BTC: 0.01893},
    Mock: {USD: 0.02619, EUR: 0.02337, BTC: 0.00000227}
  };

  beforeEach(() => {
    mockedAggregateBalanceObserver.priceObserverCallback(tokenPrices);
    mockedAggregateBalanceObserver.balanceObserverCallback(tokenDetailsWithBalance);
  });

  context('getTokenTotalWorth', () => {
    it('addBalances {} + {USD, EUR, BTC}', () => {
      const token1TotalWorth = {};
      const token2TotalWorth = {USD: 1838.51, EUR: 1494.71, BTC: 0.09893};

      const tokensTotalWorth = mockedAggregateBalanceObserver.addBalances(token1TotalWorth, token2TotalWorth);

      expect(tokensTotalWorth).to.deep.equal({USD: 1838.51, EUR: 1494.71, BTC: 0.09893});
    });

    it('addBalances {USD, EUR, BTC} + {USD, EUR, BTC}', () => {
      const token1TotalWorth = {USD: 218.21, EUR: 194.38, BTC: 0.01893};
      const token2TotalWorth = {USD: 1838.51, EUR: 1494.71, BTC: 0.09893};

      const tokensTotalWorth = mockedAggregateBalanceObserver.addBalances(token1TotalWorth, token2TotalWorth);

      expect(tokensTotalWorth).to.deep.equal({USD: 218.21 + 1838.51, EUR: 194.38 + 1494.71, BTC: 0.01893 + 0.09893});
    });
  });

  context('getTokenTotalWorth', () => {
    it('ETH', () => {
      const expectedEthTotalWorth = {USD: 1 * 218.21, EUR: 1 * 194.38, BTC: 1 * 0.01893};

      const actualEthTotalWorth = mockedAggregateBalanceObserver.getTokenTotalWorth(tokenDetailsWithBalance[0]);

      expect(actualEthTotalWorth).to.be.deep.equal(expectedEthTotalWorth);
    });

    it('token', () => {
      const expectedTokenTotalWorth = {USD: 2 * 0.02619, EUR: 2 * 0.02337, BTC: 2 * 0.00000227};

      const actualTokenTotalWorth = mockedAggregateBalanceObserver.getTokenTotalWorth(tokenDetailsWithBalance[1]);

      expect(actualTokenTotalWorth).to.be.deep.equal(expectedTokenTotalWorth);
    });
  });

  context('getAggregatedTotalWorth', () => {
    it('[eth]', async () => {
      mockedAggregateBalanceObserver.balanceObserverCallback([tokenDetailsWithBalance[0]]);
      const expectedTotalWorth = {USD: 1 * 218.21, EUR: 1 * 194.38, BTC: 1 * 0.01893};

      const actualTotalWorth = mockedAggregateBalanceObserver.getAggregatedTotalWorth();

      expect(actualTotalWorth).to.be.deep.equal(expectedTotalWorth);
    });

    it('[eth, token]', async () => {
      const expectedTotalWorth = {USD: 1 * 218.21 + 2 * 0.02619, EUR: 1 * 194.38 + 2 * 0.02337, BTC: 1 * 0.01893 + 2 * 0.00000227};

      const actualTotalWorth = mockedAggregateBalanceObserver.getAggregatedTotalWorth();

      expect(actualTotalWorth).to.be.deep.equal(expectedTotalWorth);
    });
  });
});
