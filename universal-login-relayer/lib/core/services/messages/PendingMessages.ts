import {Wallet, Contract} from 'ethers';
import {calculateMessageHash, SignedMessage, INVALID_KEY, ensure, MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution, InvalidTransaction, NotEnoughSignatures} from '../../utils/errors';
import IMessageRepository from './IMessagesRepository';
import {getKeyFromHashAndSignature, createMessageItem} from '../../utils/utils';
import QueueService from './QueueService';

export default class PendingMessages {

  constructor(
    private wallet : Wallet,
    private messagesRepository: IMessageRepository,
    private queueService: QueueService
  ) {}

  async isPresent(messageHash : string) {
    return this.messagesRepository.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<MessageStatus> {
    const messageHash = calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const messageItem = createMessageItem(message);
      await this.messagesRepository.add(messageHash, messageItem);
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
    const messageItem = await this.messagesRepository.get(messageHash);
    ensure(!messageItem.transactionHash, DuplicatedExecution);
    const isContainSignature = await this.messagesRepository.containSignature(messageHash, message.signature);
    ensure(!isContainSignature, DuplicatedSignature);
    await this.ensureCorrectKeyPurpose(message, messageItem.walletAddress, this.wallet);
    await this.messagesRepository.addSignature(messageHash, message.signature);
  }

  private async ensureCorrectKeyPurpose(message: SignedMessage, walletAddress: string, wallet: Wallet) {
    const key = getKeyFromHashAndSignature(
      calculateMessageHash(message),
      message.signature
    );
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    const keyPurpose = await walletContract.getKeyPurpose(key);
    ensure(!keyPurpose.eq(INVALID_KEY), InvalidSignature, 'Invalid key purpose');
  }

  async getStatus(messageHash: string) {
    return this.messagesRepository.getStatus(messageHash, this.wallet);
  }

  async confirmExecution(messageHash: string, transactionHash: string) {
    ensure(transactionHash.length === 66, InvalidTransaction, transactionHash);
    await this.messagesRepository.markAsSuccess(messageHash, transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    const {required, transactionHash, totalCollected} = await this.messagesRepository.getStatus(messageHash, this.wallet);
    ensure(!transactionHash, DuplicatedExecution);
    ensure(await this.isEnoughSignatures(messageHash), NotEnoughSignatures, required, totalCollected);
  }

  async isEnoughSignatures(messageHash: string) : Promise<boolean> {
    const {totalCollected, required} = await this.messagesRepository.getStatus(messageHash, this.wallet);
    return totalCollected >= required;
  }

  async get(messageHash: string) {
    return this.messagesRepository.get(messageHash);
  }

  async remove(messageHash: string) {
    return this.messagesRepository.remove(messageHash);
  }
}
