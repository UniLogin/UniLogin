import {Device, DeviceInfo, RelayerRequest} from '@unilogin/commons';
import {DevicesStore} from '../../integration/sql/services/DevicesStore';
import RelayerRequestSignatureValidator from '../../integration/ethereum/validators/RelayerRequestSignatureValidator';

export class DevicesService {
  constructor(private devicesStore: DevicesStore, private relayerRequestSignatureValidator: RelayerRequestSignatureValidator) {
  }

  add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    return this.devicesStore.add(contractAddress, publicKey, deviceInfo);
  }

  async addOrUpdate(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    await this.devicesStore.remove(contractAddress, publicKey);
    return this.devicesStore.add(contractAddress, publicKey, deviceInfo);
  }

  async getDevices(devicesRequest: RelayerRequest): Promise<Device[]> {
    await this.relayerRequestSignatureValidator.ensureValidRelayerRequestSignature(devicesRequest);
    return this.devicesStore.get(devicesRequest.contractAddress);
  }

  remove(contractAddress: string, publicKey: string) {
    return this.devicesStore.remove(contractAddress, publicKey);
  }
}
