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
    const hash = calculateMessageHash(message);
    if (!this.isPresent(hash)) {
      this.messagesStore.add(hash, new PendingMessage(message.from, this.wallet));
    }
    await this.addSignatureToPendingMessage(hash, message);
    return hash;
  }

  private async addSignatureToPendingMessage(hash: string, message: SignedMessage) {
    const pendingMessage = this.messagesStore.get(hash);
    this.ensureCorrectTransactionHash(pendingMessage.transactionHash);
    if (pendingMessage.containSignature(message.signature)) {
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
    this.messagesStore.addSignature(hash, message.signature);
  }

  async getStatus(hash: string) {
    return this.messagesStore.getStatus(hash);
  }

  getMessageWithSignatures(message: SignedMessage, hash: string) : SignedMessage {
    const collectedSignatures = this.messagesStore.getCollectedSignatures(hash);
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

  async isEnoughSignatures(hash: string) : Promise<boolean> {
    return this.messagesStore.get(hash).isEnoughSignatures();
  }

  get(hash: string) {
    return this.messagesStore.get(hash);
  }

  remove(hash: string) {
    return this.messagesStore.remove(hash);
  }
}
