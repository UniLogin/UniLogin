import {DeviceInfo, RelayerRequest} from '@universal-login/commons';
import {DevicesStore, DeviceEntry} from '../../integration/sql/services/DevicesStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

export class DevicesService {
  constructor(private devicesStore: DevicesStore, private walletMasterContractService: WalletMasterContractService) {
  }

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    return this.devicesStore.add(contractAddress, publicKey, deviceInfo);
  }

  async getDevices(devicesRequest: RelayerRequest) {
    await this.walletMasterContractService.ensureValidRelayerRequestSignature(devicesRequest);
    const devices = await this.devicesStore.get(devicesRequest.contractAddress);
    return devices.map((device: DeviceEntry) => device.deviceInfo);
  }
}
