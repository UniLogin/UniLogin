import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {providers, Wallet, utils} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TokensValueConverter, BalanceChecker, TokenDetails, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil} from '@universal-login/commons';
import {AggregateBalanceObserver} from '../../../lib/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../lib/core/observers/BalanceObserver';
import {createMockedPriceObserver} from '../../mock/PriceObserver';
import {SdkConfigDefault} from '../../../lib/config/SdkConfigDefault';
import {TokensDetailsStore} from '../../../lib/integration/ethereum/TokensDetailsStore';

chai.use(sinonChai);

describe('INT: AggregateBalanceObserver', () => {
  let provider: providers.Provider;
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let mockedAggregateBalanceObserver: AggregateBalanceObserver;
  let wallet: Wallet;
  const {mockedPriceObserver, resetCallCount} = createMockedPriceObserver();
  const tokensValueConverter = new TokensValueConverter(SdkConfigDefault.observedCurrencies);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);

    balanceChecker = new BalanceChecker(provider);
    const observedTokens: TokenDetails[] = [
      ETHER_NATIVE_TOKEN
    ];
    balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, {tokensDetails: observedTokens} as TokensDetailsStore, 10);

    mockedAggregateBalanceObserver = new AggregateBalanceObserver(balanceObserver, mockedPriceObserver, tokensValueConverter);
    resetCallCount();
  });

  it('1 subscription - balance 0 -> prices changed', async () => {
    const callback = sinon.spy();

    const unsubscribe = mockedAggregateBalanceObserver.subscribe(callback);

    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledOnce;

    await mockedPriceObserver.execute();

    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledTwice;
    unsubscribe();

    expect(callback.firstCall.args[0]).to.deep.equal({USD: 0, EUR: 0, BTC: 0});
    expect(callback.secondCall.args[0]).to.deep.equal({USD: 0, EUR: 0, BTC: 0});
  });

  it('1 subscription - balance 0 -> balance changed -> prices changed', async () => {
    const callback = sinon.spy();

    const unsubscribe = mockedAggregateBalanceObserver.subscribe(callback);

    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledOnce;

    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});

    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledTwice;

    await mockedPriceObserver.execute();

    await waitUntil(() => !!callback.thirdCall);
    expect(callback).to.have.been.calledThrice;
    unsubscribe();

    expect(callback.firstCall.args[0]).to.deep.equal({USD: 0, EUR: 0, BTC: 0});
    expect(callback.secondCall.args[0]).to.deep.equal({USD: 109.105, EUR: 97.19, BTC: 0.009465});
    expect(callback.thirdCall.args[0]).to.deep.equal({USD: 919.255, EUR: 747.355, BTC: 0.049465});
  });

  it('2 subscriptions - no change -> balance changed -> prices changed', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = mockedAggregateBalanceObserver.subscribe(callback1);
    const unsubscribe2 = mockedAggregateBalanceObserver.subscribe(callback2);

    await waitUntil(() => !!callback1.firstCall);
    expect(callback1).to.have.been.calledOnce;

    await waitUntil(() => !!callback2.firstCall);
    expect(callback2).to.have.been.calledOnce;

    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});

    await waitUntil(() => !!callback1.secondCall);
    expect(callback1).to.have.been.calledTwice;

    await waitUntil(() => !!callback2.secondCall);
    expect(callback2).to.have.been.calledTwice;

    unsubscribe1();

    await mockedPriceObserver.execute();

    await waitUntil(() => !!callback2.thirdCall);
    expect(callback2).to.have.been.calledThrice;

    unsubscribe2();

    expect(callback1.firstCall.args[0]).to.deep.equal({USD: 0, EUR: 0, BTC: 0});
    expect(callback1.secondCall.args[0]).to.deep.equal({USD: 109.105, EUR: 97.19, BTC: 0.009465});

    expect(callback2.firstCall.args[0]).to.deep.equal({USD: 0, EUR: 0, BTC: 0});
    expect(callback2.secondCall.args[0]).to.deep.equal({USD: 109.105, EUR: 97.19, BTC: 0.009465});
    expect(callback2.thirdCall.args[0]).to.deep.equal({USD: 919.255, EUR: 747.355, BTC: 0.049465});
  });
});
