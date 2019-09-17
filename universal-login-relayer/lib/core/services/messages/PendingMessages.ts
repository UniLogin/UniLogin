import {Wallet, Contract} from 'ethers';
import {calculateMessageHash, SignedMessage, ensure, MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {MessageStatusService} from './MessageStatusService';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution, NotEnoughSignatures} from '../../utils/errors';
import IMessageRepository from './IMessagesRepository';
import {getKeyFromHashAndSignature} from '../../utils/encodeData';
import QueueService from './QueueService';
import {createMessageItem} from '../../utils/messages/serialisation';

export default class PendingMessages {

  constructor(
    private wallet : Wallet,
    private messageRepository: IMessageRepository,
    private queueService: QueueService,
    private statusService: MessageStatusService
  ) {}

  async isPresent(messageHash : string) {
    return this.messageRepository.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<MessageStatus> {
    const messageHash = calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const messageItem = createMessageItem(message);
      await this.messageRepository.add(messageHash, messageItem);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    const status = await this.getStatus(messageHash);
    status.messageHash = messageHash;
    if (await this.isEnoughSignatures(messageHash)) {
      await this.onReadyToExecute(messageHash, message);
    }
    return status;
  }

  private async onReadyToExecute(messageHash: string, message: SignedMessage) {
    await this.ensureCorrectExecution(messageHash);
    return this.queueService.add(message);
  }

  private async addSignatureToPendingMessage(messageHash: string, message: SignedMessage) {
    const messageItem = await this.messageRepository.get(messageHash);
    ensure(!messageItem.transactionHash, DuplicatedExecution);
    const isContainSignature = await this.messageRepository.containSignature(messageHash, message.signature);
    ensure(!isContainSignature, DuplicatedSignature);
    await this.ensureCorrectKeyPurpose(message, messageItem.walletAddress, this.wallet);
    await this.messageRepository.addSignature(messageHash, message.signature);
  }

  private async ensureCorrectKeyPurpose(message: SignedMessage, walletAddress: string, wallet: Wallet) {
    const key = getKeyFromHashAndSignature(
      calculateMessageHash(message),
      message.signature
    );
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    ensure(await walletContract.keyExist(key), InvalidSignature, 'Invalid key');
  }

  async getStatus(messageHash: string) {
    return this.statusService.getStatus(messageHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    const {required, transactionHash, totalCollected} = await this.statusService.getStatus(messageHash);
    ensure(!transactionHash, DuplicatedExecution);
    ensure(await this.isEnoughSignatures(messageHash), NotEnoughSignatures, required, totalCollected);
  }

  async isEnoughSignatures(messageHash: string) : Promise<boolean> {
    const {totalCollected, required} = await this.getStatus(messageHash);
    return totalCollected >= required;
  }
}
