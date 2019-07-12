import {expect} from 'chai';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, waitUntil, signGetAuthorisationRequest, GetAuthorisationRequest, createKeyPair} from '@universal-login/commons';
import RelayerObserver from '../../lib/observers/RelayerObserver';

describe('Unit: RelayerObserver', () => {
  const relayerApi = {getPendingAuthorisations: async () => ({response: 'authorisation'})};
  let relayerObserver: RelayerObserver;
  let getAuthorisationRequest: GetAuthorisationRequest;
  let fakeGetAuthorisationRequest: GetAuthorisationRequest;
  let privateKey: string;

  const createGetAuthorisationRequest = (walletContractAddress: string, privateKey: string) => {
    const getAuthorisationRequest: GetAuthorisationRequest = {
      walletContractAddress,
      signature: ''
    };
    signGetAuthorisationRequest(getAuthorisationRequest, privateKey);
    return getAuthorisationRequest;
  };

  beforeEach(() => {
    relayerObserver = new RelayerObserver(relayerApi as any);
    ({privateKey} = createKeyPair());
    getAuthorisationRequest = createGetAuthorisationRequest(TEST_ACCOUNT_ADDRESS, privateKey);
    fakeGetAuthorisationRequest = createGetAuthorisationRequest('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', privateKey);
    relayerObserver.step = 10;
  });

  it('should call callback with authorisation', async () => {
    const callback = sinon.spy();
    relayerObserver.subscribe(getAuthorisationRequest, callback);
    expect(callback).to.have.been.calledWith([]);
  });

  it('new subscription request should be rejected', async () => {
    const callback = sinon.spy();
    relayerObserver.subscribe(getAuthorisationRequest, callback);
    expect(() => relayerObserver.subscribe(fakeGetAuthorisationRequest, callback)).to.throw('Another wallet is subscribed.');
    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledWith([]);
    expect(callback).to.have.been.calledWith('authorisation');
  });

  it('Subscribe. Unsubscribe', async () => {
    const callback = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe = relayerObserver.subscribe(getAuthorisationRequest, callback);
    await unsubscribe();
    relayerObserver.subscribe(getAuthorisationRequest, callback2);
    await waitUntil(() => !!callback2.firstCall);
    expect(callback2).to.have.been.calledOnce;
  });

  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe1 = relayerObserver.subscribe(getAuthorisationRequest, callback1);
    expect(callback1).to.have.been.calledWith([]);
    await waitUntil(() => !!callback1.secondCall);
    const unsubscribe2 = relayerObserver.subscribe(getAuthorisationRequest, callback2);
    expect(callback2).to.have.been.calledWith('authorisation');
    unsubscribe1();
    unsubscribe2();
  });
});
