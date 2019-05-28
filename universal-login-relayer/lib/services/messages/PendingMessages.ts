import {Wallet} from 'ethers';
import {calculateMessageHash, concatenateSignatures, SignedMessage, INVALID_KEY} from '@universal-login/commons';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution, InvalidTransaction, NotEnoughSignatures} from '../../utils/errors';
import {getKeyFromHashAndSignature, sortExecutionsByKey} from '../../utils/utils';
import PendingMessage from './PendingMessage';
import IPendingMessagesStore, {CollectedSignature} from './IPendingMessagesStore';

export default class PendingMessages {

  constructor(private wallet : Wallet, private messagesStore: IPendingMessagesStore) {
  }

  isPresent(messageHash : string) {
    return this.messagesStore.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<string> {
    const messageHash = calculateMessageHash(message);
    if (!this.isPresent(messageHash)) {
      this.messagesStore.add(messageHash, new PendingMessage(message.from, this.wallet));
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    return messageHash;
  }

  private async addSignatureToPendingMessage(messageHash: string, message: SignedMessage) {
    const pendingMessage = this.messagesStore.get(messageHash);
    this.ensureCorrectTransactionHash(pendingMessage.transactionHash);
    if (this.messagesStore.containSignature(messageHash, message.signature)) {
      throw new DuplicatedSignature();
    }
    const key = getKeyFromHashAndSignature(
      calculateMessageHash(message),
      message.signature
    );
    const keyPurpose = await pendingMessage.walletContract.getKeyPurpose(key);
    if (keyPurpose.eq(INVALID_KEY)) {
      throw new InvalidSignature('Invalid key purpose');
    }
    this.messagesStore.addSignature(messageHash, message.signature);
  }

  async getStatus(messageHash: string) {
    return this.messagesStore.getStatus(messageHash);
  }

  getMessageWithSignatures(message: SignedMessage, messageHash: string) : SignedMessage {
    const collectedSignatures = this.messagesStore.getCollectedSignatures(messageHash);
    const sortedExecutions = sortExecutionsByKey([...collectedSignatures]);
    const sortedSignatures = sortedExecutions.map((value: CollectedSignature) => value.signature);
    const signature = concatenateSignatures(sortedSignatures);
    return  { ...message, signature};
  }

  confirmExecution(messageHash: string, transactionHash: string) {
    if (transactionHash.length !== 66) {
      throw new InvalidTransaction(transactionHash);
    }
    this.messagesStore.updateTransactionHash(messageHash, transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    const {required, transactionHash, totalCollected} = await this.messagesStore.getStatus(messageHash);
    this.ensureCorrectTransactionHash(transactionHash);
    if (!(await this.isEnoughSignatures(messageHash))) {
      throw new NotEnoughSignatures(required, totalCollected);
    }
  }

  private ensureCorrectTransactionHash(transactionHash: string) {
    if (transactionHash !== '0x0') {
      throw new DuplicatedExecution();
    }
  }

  async isEnoughSignatures(messageHash: string) : Promise<boolean> {
    return this.messagesStore.get(messageHash).isEnoughSignatures();
  }

  get(messageHash: string) {
    return this.messagesStore.get(messageHash);
  }

  remove(messageHash: string) {
    return this.messagesStore.remove(messageHash);
  }
}
