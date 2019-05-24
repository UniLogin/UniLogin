import PendingMessage from './PendingMessage';
import {calculateMessageHash, SignedMessage, INVALID_KEY} from '@universal-login/commons';
import {Wallet} from 'ethers';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution} from '../../utils/errors';
import {getKeyFromHashAndSignature} from '../../utils/utils';
import IPendingMessagesStore from './IPendingMessagesStore';

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
    if (pendingMessage.transactionHash !== '0x0') {
      throw new DuplicatedExecution();
    }
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
    return  { ...message, signature: this.messagesStore.get(hash).getConcatenatedSignatures()};
  }

  confirmExecution(messageHash: string, transactionHash: string) {
    this.messagesStore.get(messageHash).confirmExecution(transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    this.messagesStore.get(messageHash).ensureCorrectExecution();
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
