import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {DevicesObserver} from '../../../lib/core/observers/DevicesObserver';
import {RelayerApi} from '../../../lib/integration/http/RelayerApi';
import {signRelayerRequest, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, RelayerRequest, TEST_ACCOUNT_ADDRESS, waitExpect} from '@universal-login/commons';

chai.use(sinonChai);

describe('UNIT: DevicesObserver', () => {
  const getConnectedDevices = sinon.stub();
  let devicesObserver: DevicesObserver;
  let relayerRequest: RelayerRequest;

  before(() => {
    const relayerApi = new RelayerApi('');
    relayerApi.getConnectedDevices = getConnectedDevices.returns({response: []});
    devicesObserver = new DevicesObserver(relayerApi, 20);
    relayerRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, TEST_PRIVATE_KEY);
  });

  it('call callback if new devices', async () => {
    const callback = sinon.spy();
    const connectedDevices = [{
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_ACCOUNT_ADDRESS,
      type: 'mobile'
    }];
    getConnectedDevices.onThirdCall().returns({response: connectedDevices});
    const unsubscribe = devicesObserver.subscribe(relayerRequest, callback);
    await waitExpect(() => expect(getConnectedDevices).calledOnce);
    expect(callback.firstCall).has.been.calledWith([]);
    await waitExpect(() => expect(getConnectedDevices).calledThrice);
    expect(callback.secondCall).has.been.calledWith(connectedDevices);
    expect(callback).callCount(2);
    unsubscribe();
  });

  it('throw error if another wallet subscribe', () => {
    const unsubscribe = devicesObserver.subscribe(relayerRequest, () => {});
    expect(() => devicesObserver.subscribe(signRelayerRequest({contractAddress: TEST_ACCOUNT_ADDRESS}, TEST_PRIVATE_KEY), () => {})).throw('Another wallet is subscribed for connected devices');
    unsubscribe();
  });

  it('correctly unsubscribe', () => {
    const unsubscribe = devicesObserver.subscribe(relayerRequest, () => {});
    unsubscribe();
    const callback = sinon.spy();
    const unsubscribe2 = devicesObserver.subscribe(signRelayerRequest({contractAddress: TEST_ACCOUNT_ADDRESS}, TEST_PRIVATE_KEY), callback);
    expect(callback.firstCall).has.been.calledWith([]);
    unsubscribe2();
  });

  afterEach(() => {
    getConnectedDevices.resetBehavior();
    getConnectedDevices.resetHistory();
    getConnectedDevices.returns({response: []});
  });

});
