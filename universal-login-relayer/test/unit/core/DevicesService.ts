import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, signRelayerRequest, createKeyPair, recoverFromRelayerRequest} from '@universal-login/commons';
import {DevicesService} from '../../../lib/core/services/DevicesService';
import {DevicesStore} from '../../../lib/integration/sql/services/DevicesStore';
import {UnauthorisedAddress} from '../../../lib/core/utils/errors';

chai.use(chaiAsPromised);

describe('UNIT: DevicesService', () => {
  const keyPair = createKeyPair();
  const relayerRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, keyPair.privateKey);
  const invalidRequest = signRelayerRequest({contractAddress: TEST_CONTRACT_ADDRESS}, TEST_PRIVATE_KEY);
  const walletMasterContractService: any = {
    ensureValidRelayerRequestSignature: sinon.stub()
  };
  let devicesStore: DevicesStore;
  let devicesService: DevicesService;

  before(() => {
    walletMasterContractService.ensureValidRelayerRequestSignature.resolves();
    walletMasterContractService.ensureValidRelayerRequestSignature.withArgs(invalidRequest).rejects(new UnauthorisedAddress(recoverFromRelayerRequest(invalidRequest)));
  });

  beforeEach(async () => {
    devicesStore = new DevicesStore();
    devicesService = new DevicesService(devicesStore, walletMasterContractService);
  });

  it('add device', async () => {
    await devicesService.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([TEST_DEVICE_INFO]);
  });

  it('get devices', async () => {
    await devicesService.add(TEST_CONTRACT_ADDRESS, keyPair.publicKey, TEST_DEVICE_INFO);
    const devices = await devicesService.getDevices(relayerRequest);
    expect(devices).to.be.deep.eq([TEST_DEVICE_INFO]);
  });

  it('unauthorised get devices', async () => {
    expect(await devicesService.add(TEST_CONTRACT_ADDRESS, keyPair.publicKey, TEST_DEVICE_INFO));
    await expect(devicesService.getDevices(invalidRequest)).rejectedWith('Unauthorised address: 0x1FB1E54022BcB566883A0A518E23f9e954C2ED83');
  });
});
