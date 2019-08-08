import {expect} from 'chai';
import sinon from 'sinon';
import {ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TokenDetails, waitUntil} from '@universal-login/commons';
import {PriceObserver, ObservedCurrency} from '../../../lib/core/observers/PriceObserver';

describe('UNIT: PriceObserver', () => {
  const observedTokens: TokenDetails[] = [
    ETHER_NATIVE_TOKEN,
    {address: TEST_CONTRACT_ADDRESS, symbol: 'AMB', name: 'Ambrosus'}
  ];
  const observedCurrencies: ObservedCurrency[] = ['USD', 'EUR', 'BTC'];
  const pricesBefore = {
    ETH: { USD: 218.21, EUR: 194.38, BTC: 0.01893 },
    AMB: { USD: 0.02619, EUR: 0.02337, BTC: 0.00000227 }
  };
  const pricesAfter = {
    ETH: { USD: 1838.51, EUR: 1494.71, BTC: 0.09893 },
    AMB: { USD: 0.2391, EUR: 0.1942, BTC: 0.00001427 }
  };

  let callCount = 0;
  const mockedPriceOracle = new PriceObserver(observedTokens, observedCurrencies, 100);
  mockedPriceOracle.getCurrentPrices = async () => {
    callCount++;
    if (callCount === 1) {
      return pricesBefore;
    } else if (callCount === 2) {
      return pricesAfter;
    }
    return {};
  };

  beforeEach(() => {
    callCount = 0;
  });

  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = mockedPriceOracle.subscribe(callback);
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledOnce;

    await mockedPriceOracle.tick();

    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledTwice;
    unsubscribe();

    expect(callback.firstCall.args[0]).to.deep.equal(pricesBefore);
    expect(callback.secondCall.args[0]).to.deep.equal(pricesAfter);
  });

  it('2 subscription', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = mockedPriceOracle.subscribe(callback1);
    await waitUntil(() => !!callback1.firstCall);

    const unsubscribe2 = mockedPriceOracle.subscribe(callback2);
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;

    expect(callback1.firstCall.args[0]).to.deep.equal(pricesBefore);
    expect(callback2.firstCall.args[0]).to.deep.equal(pricesBefore);

    await mockedPriceOracle.tick();
    await waitUntil(() => !!callback2.secondCall);

    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledTwice;

    expect(callback2.secondCall.args[0]).to.deep.equal(pricesAfter);
  });
});
