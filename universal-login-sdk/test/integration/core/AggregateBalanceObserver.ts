import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {providers, Wallet, Contract, utils} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {BalanceChecker, TokenDetails, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {PriceOracle} from '../../../lib/core/services/PriceOracle';

chai.use(sinonChai);

describe('INT: AggregateBalanceObserver', () => {
  let provider: providers.Provider;
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let aggregateBalanceObserver: AggregateBalanceObserver;
  let wallet: Wallet;
  let mockToken: Contract;
  let observedTokens: TokenDetails[] = [];
  const priceOracle = new PriceOracle();
  const ETH_PRICE_IN_USD = 1405;
  const ETH_PRICE_IN_EUR = 1152;


  beforeEach(async () => {
    provider = createMockProvider();
    balanceChecker = new BalanceChecker(provider);
    [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, MockToken);

    observedTokens = [
      ETHER_NATIVE_TOKEN,
      {address: mockToken.address, symbol: 'Mock', name: 'MockToken'}
    ];
    balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, observedTokens);
    aggregateBalanceObserver = new AggregateBalanceObserver(balanceObserver, priceOracle);
  });

  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = aggregateBalanceObserver.subscribe(callback, 'USD');
    await waitUntil(() => !!callback.firstCall);

    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();

    expect(callback).to.have.been.calledTwice;

    expect(callback.firstCall.args[0]).to.equal(0);
    expect(callback.secondCall.args[0]).to.be.greaterThan(0.5 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(0.5 * ETH_PRICE_IN_USD + 0.1);
  });

  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});

    const unsubscribe1 = aggregateBalanceObserver.subscribe(callback1, 'USD');
    await waitUntil(() => !!callback1.firstCall);

    const unsubscribe2 = aggregateBalanceObserver.subscribe(callback2, 'EUR');
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;

    expect(callback1.firstCall.args[0]).to.be.greaterThan(0.5 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(0.5 * ETH_PRICE_IN_USD + 0.1);
    expect(callback2.firstCall.args[0]).to.be.greaterThan(0.5 * ETH_PRICE_IN_EUR - 0.1).and.to.be.lessThan(0.5 * ETH_PRICE_IN_EUR + 0.1);

    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.3')});
    await waitUntil(() => !!callback2.secondCall);

    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledTwice;

    expect(callback2.secondCall.args[0]).to.be.greaterThan(0.8 * ETH_PRICE_IN_EUR - 0.1).and.to.be.lessThan(0.8 * ETH_PRICE_IN_EUR + 0.1);
  });
});
