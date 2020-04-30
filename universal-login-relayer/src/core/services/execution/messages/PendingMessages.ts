import {ensure, MessageStatus, SignedMessage} from '@unilogin/commons';
import {MessageStatusService} from './MessageStatusService';
import {DuplicatedExecution, DuplicatedSignature, InvalidSignature, NotEnoughSignatures} from '../../../utils/errors';
import IMessageRepository from '../../../models/messages/IMessagesRepository';
import {createMessageItem} from '../../../utils/messages/serialisation';
import {IExecutionQueue} from '../../../models/execution/IExecutionQueue';
import {WalletContractService} from '../../../../integration/ethereum/WalletContractService';

export default class PendingMessages {
  constructor(
    private messageRepository: IMessageRepository,
    private executionQueue: IExecutionQueue,
    private statusService: MessageStatusService,
    private walletContractService: WalletContractService,
  ) {}

  async isPresent(messageHash: string) {
    return this.messageRepository.isPresent(messageHash);
  }

  async add(message: SignedMessage, refundPayerId?: string): Promise<MessageStatus> {
    const messageHash = await this.walletContractService.calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const messageItem = createMessageItem(message);
      await this.messageRepository.add(messageHash, messageItem);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    const status = await this.getStatus(messageHash);
    const required = (await this.walletContractService.getRequiredSignatures(message.from)).toNumber();
    const isEnough = this.isEnoughSignatures(status, required);
    if (isEnough) {
      await this.onReadyToExecute(messageHash, status, required);
    }
    return status;
  }

  private async onReadyToExecute(messageHash: string, status: MessageStatus, required: number) {
    await this.ensureCorrectExecution(status, required);
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

  async getStatus(messageHash: string) {
    return this.statusService.getStatus(messageHash);
  }

  async ensureCorrectExecution(messageStatus: MessageStatus, required: number) {
    const {transactionHash, totalCollected} = messageStatus;
    ensure(!transactionHash, DuplicatedExecution);
    const isEnough = this.isEnoughSignatures(messageStatus, required);
    ensure(isEnough, NotEnoughSignatures, required, totalCollected);
  }

  isEnoughSignatures(messageStatus: MessageStatus, required: number): boolean {
    const {totalCollected} = messageStatus;
    return totalCollected >= required;
  }
}
