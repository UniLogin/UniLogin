import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider} from 'ethereum-waffle';
import {TokenDetailsWithBalance, BalanceChecker, ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import {PriceOracle} from '../../../lib/core/services/PriceOracle';

describe('UNIT: AggregateBalanceObserver', () => {
  const priceOracle = new PriceOracle();
  const provider = createMockProvider();
  const balanceChecker = new BalanceChecker(provider);
  const balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, []);
  const aggregateBalanceObserver = new AggregateBalanceObserver(balanceObserver, priceOracle);
  const tokenDetailsWithBalance: TokenDetailsWithBalance[] = [
    {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('1')},
    {address: TEST_CONTRACT_ADDRESS, symbol: 'Mock', name: 'MockToken', balance: utils.parseEther('2')}
  ];
  const ETH_PRICE_IN_USD = 1405;

  context('token balance in USD', async () => {
    it('ETH', async () => {
      const ethBalanceInUSD = await aggregateBalanceObserver.getTokenBalance(tokenDetailsWithBalance[0], 'USD');

      expect(ethBalanceInUSD).to.be.greaterThan(1 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(1 * ETH_PRICE_IN_USD + 0.1);
    });

    it('token', async () => {
      const tokenBalanceInUSD = await aggregateBalanceObserver.getTokenBalance(tokenDetailsWithBalance[1], 'USD');

      expect(tokenBalanceInUSD).to.be.greaterThan(2 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(2 * ETH_PRICE_IN_USD + 0.1);
    });
  });

  context('total balance in USD', async () => {
    it('[]', async () => {
      const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBalance([], 'USD');

      expect(aggregatedBalanceInUSD).to.equal(0);
    });

    it('[eth, token]', async () => {
      const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBalance(tokenDetailsWithBalance, 'USD');

      expect(aggregatedBalanceInUSD).to.be.greaterThan(3 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(3 * ETH_PRICE_IN_USD + 0.1);
    });
  });
});
