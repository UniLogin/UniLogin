import {providers} from 'ethers';
import {EMPTY_DEVICE_INFO, DecodedMessage} from '@unilogin/commons';
import {DevicesService} from '../DevicesService';
import AuthorisationStore from '../../../integration/sql/services/AuthorisationStore';
import {WalletContractService} from '../../../integration/ethereum/WalletContractService';

export class MinedTransactionHandler {
  constructor(
    private authorisationStore: AuthorisationStore,
    private devicesService: DevicesService,
    private walletContractService: WalletContractService,
  ) {}

  private async updateDevicesAndAuthorisations(contractAddress: string, key: string) {
    const authorisationEntry = await this.authorisationStore.get(contractAddress, key);
    const deviceInfo = authorisationEntry ? authorisationEntry.deviceInfo : EMPTY_DEVICE_INFO;
    await this.authorisationStore.removeRequest(contractAddress, key);
    await this.devicesService.add(contractAddress, key, deviceInfo);
  }

  async handle(sentTransaction: providers.TransactionResponse) {
    const {data, to} = sentTransaction;
    const message = await this.walletContractService.decodeExecute(to as string, data);
    if (message.to === to) {
      if (await this.walletContractService.isAddKeyCall(to as string, message.data as string)) {
        await this.handleAddKey(message);
      } else if (await this.walletContractService.isRemoveKeyCall(to as string, message.data as string)) {
        await this.handleRemoveKey(message);
      } else if (await this.walletContractService.isAddKeysCall(to as string, message.data as string)) {
        await this.handleAddKeys(message);
      }
    }
  }

  private async handleAddKey(message: DecodedMessage) {
    const [key] = await this.walletContractService.decodeKeyFromData(message.to, message.data as string);
    await this.updateDevicesAndAuthorisations(message.to, key);
  }

  private async handleRemoveKey(message: DecodedMessage) {
    const [key] = await this.walletContractService.decodeKeyFromData(message.to, message.data as string);
    await this.devicesService.remove(message.to, key);
  }

  private async handleAddKeys(message: DecodedMessage) {
    const [keys] = await this.walletContractService.decodeKeysFromData(message.to, message.data as string);
    for (const key of keys) {
      await this.updateDevicesAndAuthorisations(message.to, key);
    }
  }
}
