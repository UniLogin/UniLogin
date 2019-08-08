import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {waitUntil, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../lib/api/sdk';
import basicSDK from '../fixtures/basicSDK';

const loadFixture = createFixtureLoader();

describe('E2E: AggregateBalanceObserver', () => {
  let sdk: UniversalLoginSDK;
  let relayer: RelayerUnderTest;
  let ensName: string;
  let wallet: Wallet;
  let contractAddress: string;
  const ETH_PRICE_IN_USD = 1405;
  const ETH_PRICE_IN_EUR = 1152;

  beforeEach(async () => {
    ({sdk, relayer, ensName, wallet, contractAddress} = await loadFixture(basicSDK));
  });


  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = await sdk.subscribeToAggregatedBalance(ensName, callback, 'USD');
    await waitUntil(() => !!callback.firstCall);

    expect(callback).to.have.been.calledOnce;

    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();

    expect(callback).to.have.been.calledTwice;

    expect(callback.firstCall.args[0]).to.be.greaterThan(ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(ETH_PRICE_IN_USD + 0.1);
    expect(callback.secondCall.args[0]).to.be.greaterThan(1.5 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(1.5 * ETH_PRICE_IN_USD + 0.1);

  });

  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = await sdk.subscribeToAggregatedBalance(ensName, callback1, 'USD');
    await waitUntil(() => !!callback1.firstCall);

    const unsubscribe2 = await sdk.subscribeToAggregatedBalance(ensName, callback2, 'EUR');
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;

    expect(callback1.firstCall.args[0]).to.be.greaterThan(1 * ETH_PRICE_IN_USD - 0.1).and.to.be.lessThan(1 * ETH_PRICE_IN_USD + 0.1);
    expect(callback2.firstCall.args[0]).to.be.greaterThan(1 * ETH_PRICE_IN_EUR - 0.1).and.to.be.lessThan(1 * ETH_PRICE_IN_EUR + 0.1);

    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('0.3')});
    await waitUntil(() => !!callback2.secondCall);

    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledTwice;

    expect(callback2.secondCall.args[0]).to.be.greaterThan(1.3 * ETH_PRICE_IN_EUR - 0.1).and.to.be.lessThan(1.3 * ETH_PRICE_IN_EUR + 0.1);
  });

  after(async () => {
    await relayer.stop();
  });
});
