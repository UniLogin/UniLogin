import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider} from 'ethereum-waffle';
import {TokenDetailsWithBalance, BalanceChecker, ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';

describe('UNIT: AggregateBalanceObserver', () => {
  const priceOracle = {
    getTokenPrice: (tokenSymbol: string, currencySymbol: string) => {
      return Promise.resolve(1000);
    }
  };
  const provider = createMockProvider();
  const balanceChecker = new BalanceChecker(provider);
  const balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, []);
  const aggregateBalanceObserver = new AggregateBalanceObserver(balanceObserver, priceOracle);
  const tokenDetailsWithBalance: TokenDetailsWithBalance[] = [
    {...ETHER_NATIVE_TOKEN, balance: utils.parseEther('1')},
    {address: TEST_CONTRACT_ADDRESS, symbol: 'Mock', name: 'MockToken', balance: utils.parseEther('2')}
  ];

  context('token balance in USD', async () => {
    it('ETH', async () => {
      const ethBalanceInUSD = await aggregateBalanceObserver.getTokenBalance(tokenDetailsWithBalance[0], 'USD');

      expect(ethBalanceInUSD).to.be.greaterThan(1000 - 0.1).and.to.be.lessThan(1000 + 0.1);
    });

    it('token', async () => {
      const tokenBalanceInUSD = await aggregateBalanceObserver.getTokenBalance(tokenDetailsWithBalance[1], 'USD');

      expect(tokenBalanceInUSD).to.be.greaterThan(2000 - 0.1).and.to.be.lessThan(2000 + 0.1);
    });
  });

  context('total balance in USD', async () => {
    it('[]', async () => {
      const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBalance([], 'USD');

      expect(aggregatedBalanceInUSD).to.equal(0);
    });

    it('[eth, token]', async () => {
      const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBalance(tokenDetailsWithBalance, 'USD');

      expect(aggregatedBalanceInUSD).to.be.greaterThan(3000 - 0.1).and.to.be.lessThan(3000 + 0.1);
    });
  });
});
