import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider} from 'ethereum-waffle';
import {TokenDetailsWithBalance, BalanceChecker, ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';

describe('UNIT: AggregateBalanceObserver', () => {
  const priceOracle = {
    getTokenPrice: (tokenSymbol: string) => {
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

  it('ETH: gasTokenPrice', async () => {
    const ethBalanceInUSD = await aggregateBalanceObserver.getTokenBalanceInUSD(tokenDetailsWithBalance[0]);

    expect(ethBalanceInUSD).to.be.greaterThan(1000 - 0.1).and.to.be.lessThan(1000 + 0.1);
  });

  it('token: gasTokenPrice', async () => {
    const tokenBalanceInUSD = await aggregateBalanceObserver.getTokenBalanceInUSD(tokenDetailsWithBalance[1]);

    expect(tokenBalanceInUSD).to.be.greaterThan(2000 - 0.1).and.to.be.lessThan(2000 + 0.1);
  });

  it('aggregate []', async () => {
    const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBlanceInUSD([]);

    expect(aggregatedBalanceInUSD).to.equal(0);
  });

  it('aggregated [eth, token]', async () => {
    const aggregatedBalanceInUSD = await aggregateBalanceObserver.getAggregatedBlanceInUSD(tokenDetailsWithBalance);

    expect(aggregatedBalanceInUSD).to.be.greaterThan(3000 - 0.1).and.to.be.lessThan(3000 + 0.1);
  });
});
