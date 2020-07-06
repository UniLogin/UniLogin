import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Wallet, utils} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {TokensValueConverter, BalanceChecker, TokenDetails, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, waitUntil, ProviderService} from '@unilogin/commons';
import {AggregateBalanceObserver} from '../../../src/core/observers/AggregateBalanceObserver';
import {BalanceObserver} from '../../../src/core/observers/BalanceObserver';
import {createMockedPriceObserver} from '../../mock/PriceObserver';
import {SdkConfigDefault} from '../../../src/config/SdkConfigDefault';
import {TokensDetailsStore} from '../../../src/core/services/TokensDetailsStore';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';

chai.use(sinonChai);

describe('INT: AggregateBalanceObserver', () => {
  let provider: MockProvider;
  let balanceChecker: BalanceChecker;
  let balanceObserver: BalanceObserver;
  let mockedAggregateBalanceObserver: AggregateBalanceObserver;
  let wallet: Wallet;
  const {mockedPriceObserver, resetCallCount} = createMockedPriceObserver();
  const tokensValueConverter = new TokensValueConverter(SdkConfigDefault.observedCurrencies);

  beforeEach(() => {
    provider = new MockProvider();
    provider.pollingInterval = 10;
    [wallet] = provider.getWallets();

    const observedTokens: TokenDetails[] = [
      ETHER_NATIVE_TOKEN,
    ];
    const providerService = new ProviderService(provider);
    const blockNumberState = new BlockNumberState(providerService);
    balanceChecker = new BalanceChecker(providerService);
    balanceObserver = new BalanceObserver(balanceChecker, TEST_ACCOUNT_ADDRESS, {tokensDetails: observedTokens} as TokensDetailsStore, blockNumberState, providerService);

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

    expect(callback.firstCall.args[0]).to.deep.eq({USD: 0, DAI: 0, SAI: 0, ETH: 0});
    expect(callback.secondCall.args[0]).to.deep.eq({USD: 0, DAI: 0, SAI: 0, ETH: 0});
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

    expect(callback.firstCall.args[0]).to.deep.eq({USD: 0, DAI: 0, SAI: 0, ETH: 0});
    expect(callback.secondCall.args[0]).to.deep.eq({USD: 109.105, DAI: 97.19, SAI: 97.19, ETH: 0.009465});
    expect(callback.thirdCall.args[0]).to.deep.eq({USD: 919.255, DAI: 747.355, SAI: 747.355, ETH: 0.049465});
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

    expect(callback1.firstCall.args[0]).to.deep.eq({USD: 0, DAI: 0, SAI: 0, ETH: 0});
    expect(callback1.secondCall.args[0]).to.deep.eq({USD: 109.105, DAI: 97.19, SAI: 97.19, ETH: 0.009465});

    expect(callback2.firstCall.args[0]).to.deep.eq({USD: 0, DAI: 0, SAI: 0, ETH: 0});
    expect(callback2.secondCall.args[0]).to.deep.eq({USD: 109.105, DAI: 97.19, SAI: 97.19, ETH: 0.009465});
    expect(callback2.thirdCall.args[0]).to.deep.eq({USD: 919.255, DAI: 747.355, SAI: 747.355, ETH: 0.049465});
  });
});
