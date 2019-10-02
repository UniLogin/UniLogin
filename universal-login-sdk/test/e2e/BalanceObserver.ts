import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {waitUntil} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../lib/api/sdk';
import basicSDK from '../fixtures/basicSDK';

const loadFixture = createFixtureLoader();

describe('E2E: BalanceObserver', () => {
  let sdk: UniversalLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;
  let contractAddress: string;

  beforeEach(async () => {
    ({sdk, relayer, wallet, contractAddress} = await loadFixture(basicSDK));
  });

  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = await sdk.subscribeToBalances(contractAddress, callback);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();

    expect(callback).to.have.been.calledOnce;
  });

  it('1 subscription - balance changed', async () => {
    const callback = sinon.spy();

    const unsubscribe = await sdk.subscribeToBalances(contractAddress, callback);
    await waitUntil(() => !!callback.firstCall);

    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();

    expect(callback).to.have.been.calledTwice;
  });

  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = await sdk.subscribeToBalances(contractAddress, callback1);
    await waitUntil(() => !!callback1.firstCall);

    const unsubscribe2 = await sdk.subscribeToBalances(contractAddress, callback2);
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();
    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;
  });

  after(async () => {
    await relayer.stop();
  });
});
