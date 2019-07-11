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
    await relayerObserver.tick();
    expect(callback).to.have.been.calledWith('authorisation');
  });

  it('new subscription request should be rejected', async () => {
    const callback = sinon.spy();
    relayerObserver.subscribeAndStart(TEST_ACCOUNT_ADDRESS, callback);
    expect(() => relayerObserver.subscribe('0x1234', callback)).to.throw('Another subscription is running. Ensure you unsubscribed previous one.');
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledWith('authorisation');
  });

  it('Subscribe. Unsubscribe', async () => {
    const callback = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe = relayerObserver.subscribeAndStart(TEST_ACCOUNT_ADDRESS, callback);
    await unsubscribe();
    relayerObserver.subscribeAndStart('0x1234', callback2);
    await waitUntil(() => !!callback2.firstCall);
    expect(callback2).to.have.been.calledOnce;
  });
});
