import {expect} from 'chai';
import sinon from 'sinon';
import {ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TokenDetails, waitUntil, ObservedCurrency} from '@universal-login/commons';
import {PRICES_AFTER, PRICES_BEFORE, OBSERVED_CURRENCIES, createMockedPriceObserver} from '../../fixtures/PriceObserver';
import {PriceObserver} from '../../../lib/core/observers/PriceObserver';

describe('UNIT: PriceObserver', () => {
  const observedTokens: TokenDetails[] = [
    ETHER_NATIVE_TOKEN,
    {address: TEST_CONTRACT_ADDRESS, symbol: 'Mock', name: 'Mock Token'}
  ];

  const {mockedPriceObserver, resetCallCount} = createMockedPriceObserver(observedTokens);

  beforeEach(() => {
    resetCallCount();
  });

  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = mockedPriceObserver.subscribe(callback);
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledOnce;

    await mockedPriceObserver.tick();

    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledTwice;
    unsubscribe();

    expect(callback.firstCall.args[0]).to.deep.equal(PRICES_BEFORE);
    expect(callback.secondCall.args[0]).to.deep.equal(PRICES_AFTER);
  });

  it('2 subscription', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = mockedPriceObserver.subscribe(callback1);
    await waitUntil(() => !!callback1.firstCall);

    const unsubscribe2 = mockedPriceObserver.subscribe(callback2);
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;

    expect(callback1.firstCall.args[0]).to.deep.equal(PRICES_BEFORE);
    expect(callback2.firstCall.args[0]).to.deep.equal(PRICES_BEFORE);

    await mockedPriceObserver.tick();
    await waitUntil(() => !!callback2.secondCall);

    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledTwice;

    expect(callback2.secondCall.args[0]).to.deep.equal(PRICES_AFTER);
  });
});
