import {expect} from 'chai';
import {DevicesStore} from '../../../../lib/integration/sql/services/DevicesStore';
import {TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO} from '@universal-login/commons';
import {getKnexConfig} from '../../../helpers/knex';

describe('INT: DevicesStore', () => {
  let devicesStore: DevicesStore;
  const device2 = {
    os: 'iPhone',
    name: 'phone',
    city: 'Warsaw, Poland',
    ipAddress: '84.10.249.134',
    time: '18 minutes ago',
    browser: 'Safari'
  };

  beforeEach(() => {
    devicesStore = new DevicesStore(getKnexConfig());
  });

  it('initially empty', async () => {
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([]);
  });

  it('add to store 1 element', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([TEST_DEVICE_INFO]);
    const devices2 = await devicesStore.get(TEST_ACCOUNT_ADDRESS);
    expect(devices2).to.be.deep.eq([]);
  });

  it('add to store 2 elements', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_CONTRACT_ADDRESS, device2);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([TEST_DEVICE_INFO, device2]);
  });

  it('should remove element', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const removeItemsCount = await devicesStore.remove(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS);
    expect(removeItemsCount).to.be.eq(1);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).length(0);
  });
});
