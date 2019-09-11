import {DeviceInfo, RelayerRequest} from '@universal-login/commons';
import {DevicesStore} from '../../integration/sql/services/DevicesStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

export class DevicesService {
  constructor(private devicesStore: DevicesStore, private walletMasterContractService: WalletMasterContractService) {
  }

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    return this.devicesStore.add(contractAddress, publicKey, deviceInfo);
  }

  async getDevices(devicesRequest: RelayerRequest) {
    await this.walletMasterContractService.ensureValidRelayerRequestSignature(devicesRequest);

    return this.devicesStore.get(devicesRequest.contractAddress);
  }
}
