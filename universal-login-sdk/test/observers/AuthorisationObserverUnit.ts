import {expect} from 'chai';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, waitUntil, signGetAuthorisationRequest, GetAuthorisationRequest, createKeyPair} from '@universal-login/commons';
import AuthorisationsObserver from '../../lib/observers/AuthorisationsObserver';

describe('UNIT: AuthorisationsObserver', () => {
  const notifications = [
    {
      id: 524,
      walletContractAddress: '0xd9822cf2a4c3accd2af175a5df0376d46dcb848d',
      key: '0x6f475fa97d9d0ab1149068c1c81bd7e3a8be2139',
      deviceInfo: {
        ipAddress: '::ffff:127.0.0.1',
        name: 'unknown',
        city: 'unknown',
        os: 'unknown',
        browser: 'node-fetch',
        time: '1:30'
      }
    }
  ];
  const relayerApi = {getPendingAuthorisations: async () => ({response: notifications})};
  let authorisationsObserver: AuthorisationsObserver;
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
    authorisationsObserver = new AuthorisationsObserver(relayerApi as any);
    ({privateKey} = createKeyPair());
    getAuthorisationRequest = createGetAuthorisationRequest(TEST_ACCOUNT_ADDRESS, privateKey);
    fakeGetAuthorisationRequest = createGetAuthorisationRequest('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', privateKey);
    authorisationsObserver.step = 10;
  });

  it('should call callback with authorisation', async () => {
    const callback = sinon.spy();
    authorisationsObserver.subscribe(getAuthorisationRequest, callback);
    expect(callback).to.have.been.calledWith([]);
  });

  it('new subscription request should be rejected', async () => {
    const callback = sinon.spy();
    authorisationsObserver.subscribe(getAuthorisationRequest, callback);
    expect(() => authorisationsObserver.subscribe(fakeGetAuthorisationRequest, callback)).to.throw('Another wallet is subscribed.');
    await waitUntil(() => !!callback.secondCall);
    expect(callback).to.have.been.calledWith([]);
    expect(callback).to.have.been.calledWith(notifications);
  });

  it('Subscribe. Unsubscribe', async () => {
    const callback = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe = authorisationsObserver.subscribe(getAuthorisationRequest, callback);
    await unsubscribe();
    authorisationsObserver.subscribe(getAuthorisationRequest, callback2);
    await waitUntil(() => !!callback2.firstCall);
    expect(callback2).to.have.been.calledOnce;
  });

  it('2 subscriptions', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();
    const unsubscribe1 = authorisationsObserver.subscribe(getAuthorisationRequest, callback1);
    expect(callback1).to.have.been.calledWith([]);
    await waitUntil(() => !!callback1.secondCall);
    const unsubscribe2 = authorisationsObserver.subscribe(getAuthorisationRequest, callback2);
    expect(callback2).to.have.been.calledWith(notifications);
    unsubscribe1();
    unsubscribe2();
  });
});
