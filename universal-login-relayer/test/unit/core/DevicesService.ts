import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, signRelayerRequest, createKeyPair, recoverFromRelayerRequest} from '@universal-login/commons';
import {DevicesService} from '../../../lib/core/services/DevicesService';
import {UnauthorisedAddress} from '../../../lib/core/utils/errors';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('UNIT: DevicesService', () => {
  const keyPair = createKeyPair();
  const relayerRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, keyPair.privateKey);
  const invalidRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, TEST_PRIVATE_KEY);
  const walletMasterContractService: any = {
    ensureValidRelayerRequestSignature: sinon.stub()
  };
  const devicesStore: any = {
    add: sinon.stub().resolves(),
    get: sinon.stub().resolves([{deviceInfo: TEST_DEVICE_INFO, contractAddress: TEST_CONTRACT_ADDRESS, pubilcKey: TEST_ACCOUNT_ADDRESS}]),
    remove: sinon.stub().resolves(1)
  };
  let devicesService: DevicesService;

  before(() => {
    walletMasterContractService.ensureValidRelayerRequestSignature.resolves();
    walletMasterContractService.ensureValidRelayerRequestSignature.withArgs(invalidRequest).rejects(new UnauthorisedAddress(recoverFromRelayerRequest(invalidRequest)));
  });

  beforeEach(async () => {
    devicesService = new DevicesService(devicesStore, walletMasterContractService);
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
