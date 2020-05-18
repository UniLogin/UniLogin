import {SignedMessage, MessageStatus, ensure} from '@unilogin/commons';
import {MessageHandlerValidator} from '../../validators/MessageHandlerValidator';
import IMessageRepository from '../../../models/messages/IMessagesRepository';
import {IExecutionQueue} from '../../../models/execution/IExecutionQueue';
import {MessageStatusService} from './MessageStatusService';
import {WalletContractService} from '../../../../integration/ethereum/WalletContractService';
import {createMessageItem} from '../../../utils/messages/serialisation';
import {DuplicatedExecution, DuplicatedSignature, InvalidSignature, NotEnoughSignatures} from '../../../utils/errors';

class MessageHandler {
  constructor(
    private messageRepository: IMessageRepository,
    private executionQueue: IExecutionQueue,
    private statusService: MessageStatusService,
    private walletContractService: WalletContractService,
    private validator: MessageHandlerValidator,
  ) {

  }

  async handle(message: SignedMessage, refundPayerId?: string) {
    await this.validator.validate(message);
    const messageHash = await this.walletContractService.calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const messageItem = createMessageItem(message, '1', refundPayerId);
      await this.messageRepository.add(messageHash, messageItem);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    const status = await this.statusService.getStatus(messageHash);
    const required = (await this.walletContractService.getRequiredSignatures(message.from)).toNumber();
    if (this.isEnoughSignatures(status, required)) {
      await this.onReadyToExecute(messageHash, status, required);
      return this.statusService.getStatus(messageHash);
    }
    return status;
  }

  isPresent(messageHash: string) {
    return this.messageRepository.isPresent(messageHash);
  }

  private async onReadyToExecute(messageHash: string, status: MessageStatus, required: number) {
    this.ensureCorrectExecution(status, required);
    await this.messageRepository.setState(messageHash, 'Queued');
    return this.executionQueue.addMessage(messageHash);
  }

  private async addSignatureToPendingMessage(messageHash: string, message: SignedMessage) {
    const messageItem = await this.messageRepository.get(messageHash);
    ensure(!messageItem.transactionHash, DuplicatedExecution);
    const isContainSignature = await this.messageRepository.containSignature(messageHash, message.signature);
    ensure(!isContainSignature, DuplicatedSignature);
    const key = await this.walletContractService.recoverSignerFromMessage(message);
    ensure(await this.walletContractService.keyExist(messageItem.walletAddress, key), InvalidSignature, 'Invalid key');
    await this.messageRepository.addSignature(messageHash, message.signature, key);
  }

  ensureCorrectExecution(messageStatus: MessageStatus, required: number) {
    const {transactionHash, totalCollected} = messageStatus;
    ensure(!transactionHash, DuplicatedExecution);
    const isEnough = this.isEnoughSignatures(messageStatus, required);
    ensure(isEnough, NotEnoughSignatures, required, totalCollected);
  }

  isEnoughSignatures(messageStatus: MessageStatus, required: number): boolean {
    const {totalCollected} = messageStatus;
    return totalCollected >= required;
  }

  async getStatus(messageHash: string) {
    if (!await this.isPresent(messageHash)) {
      return null;
    }
    return this.statusService.getStatus(messageHash);
  }
}

export default MessageHandler;
