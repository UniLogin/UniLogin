import {createKeyPair, recoverFromRelayerRequest, signRelayerRequest, TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_DEVICE_INFO, TEST_PRIVATE_KEY} from '@unilogin/commons';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DevicesService} from '../../../src/core/services/DevicesService';
import {UnauthorisedAddress} from '../../../src/core/utils/errors';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('UNIT: DevicesService', () => {
  const keyPair = createKeyPair();
  const relayerRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, keyPair.privateKey);
  const invalidRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, TEST_PRIVATE_KEY);
  const relayerRequestSignatureValidator: any = {
    ensureValidRelayerRequestSignature: sinon.stub(),
  };
  const devicesStore: any = {
    add: sinon.stub().resolves(),
    get: sinon.stub().resolves([{deviceInfo: TEST_DEVICE_INFO, contractAddress: TEST_CONTRACT_ADDRESS, pubilcKey: TEST_ACCOUNT_ADDRESS}]),
    remove: sinon.stub().resolves(1),
  };
  let devicesService: DevicesService;

  before(() => {
    relayerRequestSignatureValidator.ensureValidRelayerRequestSignature.resolves();
    relayerRequestSignatureValidator.ensureValidRelayerRequestSignature.withArgs(invalidRequest).rejects(new UnauthorisedAddress(recoverFromRelayerRequest(invalidRequest)));
  });

  beforeEach(() => {
    devicesService = new DevicesService(devicesStore, relayerRequestSignatureValidator);
  });

  it('add device', async () => {
    await devicesService.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    expect(devicesStore.add).to.be.calledOnce;
    expect(devicesStore.get).to.not.be.called;
  });

  it('get devices', async () => {
    await devicesService.getDevices(relayerRequest);
    expect(devicesStore.get).to.be.calledOnceWithExactly(relayerRequest.contractAddress);
    expect(devicesStore.add).to.not.be.called;
  });

  it('unauthorised get devices', async () => {
    await expect(devicesService.getDevices(invalidRequest)).rejectedWith('Unauthorised address: 0x1FB1E54022BcB566883A0A518E23f9e954C2ED83');
    expect(devicesStore.get).to.not.be.called;
    expect(devicesStore.add).to.not.be.called;
  });

  it('add or update device', async () => {
    await devicesService.addOrUpdate(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    expect(devicesStore.remove).to.be.calledOnce;
    expect(devicesStore.remove).to.be.calledWithExactly(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS);
    expect(devicesStore.add).to.be.calledOnce;
    expect(devicesStore.add).to.be.calledWithExactly(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
  });

  afterEach(() => {
    devicesStore.get.resetHistory();
    devicesStore.add.resetHistory();
    devicesStore.remove.resetHistory();
  });
});
