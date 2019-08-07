import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {providers, Wallet, Contract, utils} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {BalanceChecker, TokenDetails, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import MockToken from '@universal-login/contracts/build/MockToken.json';

chai.use(sinonChai);

describe('INT: AggregateBalanceObserver', () => {
  let provider: providers.Provider;
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let aggregateBalanceObserver: AggregateBalanceObserver;
  let wallet: Wallet;
  let mockToken: Contract;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, MockToken);
    const supportedTokens: TokenDetails[] = [
      ETHER_NATIVE_TOKEN,
      {address: mockToken.address, symbol: 'Mock', name: 'MockToken'}
    ];

    balanceChecker = new BalanceChecker(provider);
    balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, supportedTokens);
    const priceOracle = {
      getTokenPrice: (tokenSymbol: string) => {
        return Promise.resolve(1000);
      }
    };
    aggregateBalanceObserver = new AggregateBalanceObserver(balanceObserver, priceOracle);
  });

  it('[] -> 0$', async () => {
    const callback = sinon.spy();

    const unsubscribe = aggregateBalanceObserver.subscribe(callback);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();

    expect(callback).to.have.been.calledOnce;
    expect(callback.firstCall.args[0].totalBalance).to.equal(0);
  });
});
