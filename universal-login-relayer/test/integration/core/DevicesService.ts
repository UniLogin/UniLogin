import {expect} from 'chai';
import {DevicesService} from '../../../lib/core/services/DevicesService';
import {DevicesStore} from '../../../lib/integration/sql/services/DevicesStore';

describe('INT: DevicesService', () => {
  const devicesStore = new DevicesStore();
  const devicesService = new DevicesService(devicesStore);

  before(() => {

  });

  it('add request to store', async () => {

  });
});
