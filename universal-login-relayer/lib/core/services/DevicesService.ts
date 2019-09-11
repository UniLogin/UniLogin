import {DeviceInfo} from '@universal-login/commons';
import {DevicesStore} from '../../integration/sql/services/DevicesStore';

export class DevicesService {
  constructor(private devicesStore: DevicesStore) {
  }

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    return this.devicesStore.add(contractAddress, publicKey, deviceInfo);
  }
}
