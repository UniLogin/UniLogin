import {expect} from 'chai';
import {DevicesService} from '../../../lib/core/services/DevicesService';
import {DevicesStore} from '../../../lib/integration/sql/services/DevicesStore';
import {TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO, TEST_CONTRACT_ADDRESS} from '@universal-login/commons';

describe('INT: DevicesService', () => {
  let devicesStore: DevicesStore;
  let devicesService: DevicesService;

  beforeEach(() => {
    devicesStore = new DevicesStore();
    devicesService = new DevicesService(devicesStore);
  });

  it('add device', async () => {
    await devicesService.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([TEST_DEVICE_INFO]);
  });

  it('get devices', async () => {
    await devicesService.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const devices = await devicesService.getDevices(TEST_CONTRACT_ADDRESS);
  });
});
