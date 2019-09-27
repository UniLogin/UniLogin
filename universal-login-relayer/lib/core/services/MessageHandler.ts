import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage, EMPTY_DEVICE_INFO} from '@universal-login/commons';
import {isAddKeyCall, decodeParametersFromData, isAddKeysCall, isRemoveKeyCall} from '../utils/encodeData';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import PendingMessages from './messages/PendingMessages';
import {decodeDataForExecuteSigned} from '../utils/messages/serialisation';
import IMessageRepository from './messages/IMessagesRepository';
import {IExecutionQueue} from './messages/IExecutionQueue';
import {MessageStatusService} from './messages/MessageStatusService';
import {DevicesService} from './DevicesService';
import {GasValidator} from './validators/GasValidator';

class MessageHandler {
  private pendingMessages: PendingMessages;

  constructor(
    wallet: Wallet,
    private authorisationStore: AuthorisationStore,
    private devicesService: DevicesService,
    private hooks: EventEmitter,
    messageRepository: IMessageRepository,
    statusService: MessageStatusService,
    private gasValidator: GasValidator,
    private executionQueue: IExecutionQueue
  ) {
    this.pendingMessages = new PendingMessages(wallet, messageRepository, this.executionQueue, statusService);
  }

  async onTransactionMined(sentTransaction: providers.TransactionResponse) {
    const {data, to} = sentTransaction;
    const message = decodeDataForExecuteSigned(data);
    if (message.to === to) {
      if (isAddKeyCall(message.data as string)) {
        const [key] = decodeParametersFromData(message.data as string, ['address']);
        await this.updateDevicesAndAuthorisations(to, key);
        this.hooks.emit('added', {transaction: sentTransaction, contractAddress: to});
      } else if (isRemoveKeyCall(message.data as string)) {
        const [key] = decodeParametersFromData(message.data as string, ['address']);
        await this.devicesService.remove(to, key);
      } else if (isAddKeysCall(message.data as string)) {
        const [keys] = decodeParametersFromData(message.data as string, ['address[]']);
        for (const key of keys) {
          await this.updateDevicesAndAuthorisations(to, key);
        }
        this.hooks.emit('keysAdded', {transaction: sentTransaction, contractAddress: to});
      }
    }
  }

  async handleMessage(message: SignedMessage) {
    await this.gasValidator.validate(message);
    return this.pendingMessages.add(message);
  }

  private async updateDevicesAndAuthorisations(contractAddress: string, key: string) {
    const authorisationEntry = await this.authorisationStore.get(contractAddress, key);
    const deviceInfo = authorisationEntry ? authorisationEntry.deviceInfo : EMPTY_DEVICE_INFO;
    await this.authorisationStore.removeRequest(contractAddress, key);
    await this.devicesService.add(contractAddress, key, deviceInfo);
  }

  async getStatus(messageHash: string) {
    if (!await this.pendingMessages.isPresent(messageHash)) {
      return null;
    }
    return this.pendingMessages.getStatus(messageHash);
  }
}

export default MessageHandler;
