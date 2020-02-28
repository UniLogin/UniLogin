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

  async add(message: SignedMessage): Promise<MessageStatus> {
    const messageHash = await this.walletContractService.calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const messageItem = createMessageItem(message);
      await this.messageRepository.add(messageHash, messageItem);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    const status = await this.getStatus(messageHash);
    const [isEnough] = await this.isEnoughSignatures(status, message.from);
    if (isEnough) {
      await this.onReadyToExecute(messageHash, status, message.from);
    }
    return status;
  }

  private async onReadyToExecute(messageHash: string, status: MessageStatus, contractAddress: string) {
    await this.ensureCorrectExecution(status, contractAddress);
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

  async ensureCorrectExecution(messageStatus: MessageStatus, contractAddress: string) {
    const {transactionHash, totalCollected} = messageStatus;
    ensure(!transactionHash, DuplicatedExecution);
    const [isEnoiug, required] = await this.isEnoughSignatures(messageStatus, contractAddress);
    ensure(isEnoiug, NotEnoughSignatures, required, totalCollected);
  }

  async isEnoughSignatures(messageStatus: MessageStatus, contractAddress: string): Promise<[boolean, number]> {
    const {totalCollected} = messageStatus;
    const required = (await this.walletContractService.getRequiredSignatures(contractAddress)).toNumber();
    return [totalCollected >= required, required];
  }
}
