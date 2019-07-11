import {expect} from 'chai';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, waitUntil} from '@universal-login/commons';
import RelayerObserver from '../../lib/observers/RelayerObserver';

describe('Unit: RelayerObserver', () => {
  const relayerApi = {getPendingAuthorisations: async () => ({response: 'authorisation'})};
  let relayerObserver: RelayerObserver;

  beforeEach(() => {
    relayerObserver = new RelayerObserver(relayerApi as any);
    relayerObserver.step = 10;
  });

  it('should call callback with authorisation', async () => {
    const callback = sinon.spy();
    relayerObserver.subscribe(TEST_ACCOUNT_ADDRESS, callback);
    expect(callback).to.have.been.calledWith([]);
  });

  it('new subscription request should be rejected', async () => {
    const callback = sinon.spy();
    relayerObserver.subscribe(TEST_ACCOUNT_ADDRESS, callback);
    expect(() => relayerObserver.subscribe('0x1234', callback)).to.throw('Another wallet is subscribed.');
    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledWith([]);
    expect(callback).to.have.been.calledWith('authorisation');
  });

  it('Subscribe. Unsubscribe', async () => {
    const callback = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe = relayerObserver.subscribe(TEST_ACCOUNT_ADDRESS, callback);
    await unsubscribe();
    relayerObserver.subscribe('0x1234', callback2);
    await waitUntil(() => !!callback2.firstCall);
    expect(callback2).to.have.been.calledOnce;
  });
  
  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe1 = relayerObserver.subscribe(TEST_ACCOUNT_ADDRESS, callback1);
    expect(callback1).to.have.been.calledWith([]);
    await waitUntil(() => !!callback1.secondCall);
    const unsubscribe2 = relayerObserver.subscribe(TEST_ACCOUNT_ADDRESS, callback2);
    expect(callback2).to.have.been.calledWith('authorisation');
    unsubscribe1();
    unsubscribe2();
  })
});
