import {expect} from 'chai';
import {DevicesStore} from '../../../../lib/integration/sql/services/DevicesStore';
import {TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO} from '@universal-login/commons';
import {getKnexConfig} from '../../../helpers/knex';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

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
  const knex = getKnexConfig();

  beforeEach(() => {
    devicesStore = new DevicesStore(knex);
  });

  it('initially empty', async () => {
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([]);
  });

  it('add to store 1 element', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([{deviceInfo: TEST_DEVICE_INFO, publicKey: TEST_ACCOUNT_ADDRESS, contractAddress: TEST_CONTRACT_ADDRESS}]);
    const devices2 = await devicesStore.get(TEST_ACCOUNT_ADDRESS);
    expect(devices2).to.be.deep.eq([]);
  });

  it('add to store 2 elements', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_CONTRACT_ADDRESS, device2);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).to.be.deep.eq([
      {deviceInfo: TEST_DEVICE_INFO, publicKey: TEST_ACCOUNT_ADDRESS, contractAddress: TEST_CONTRACT_ADDRESS},
      {deviceInfo: device2, publicKey: TEST_CONTRACT_ADDRESS, contractAddress: TEST_CONTRACT_ADDRESS}]);
  });

  it('should remove element', async () => {
    await devicesStore.add(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_DEVICE_INFO);
    const removeItemsCount = await devicesStore.remove(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS);
    expect(removeItemsCount).to.be.eq(1);
    const devices = await devicesStore.get(TEST_CONTRACT_ADDRESS);
    expect(devices).length(0);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });
  after(async () => {
    await knex.destroy();
  });
});
