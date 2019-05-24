import PendingMessage from './PendingMessage';
import {calculateMessageHash, SignedMessage} from '@universal-login/commons';
import {Wallet, utils} from 'ethers';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution} from '../../utils/errors';
import IPendingMessagesStore from './IPendingMessagesStore';

export default class PendingMessages {

  constructor(private wallet : Wallet, private executionsStore: IPendingMessagesStore) {
  }

  isPresent(messageHash : string) {
    return this.executionsStore.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<string> {
    const hash = calculateMessageHash(message);
    if (!this.isPresent(hash)) {
      this.executionsStore.add(hash, new PendingMessage(message.from, this.wallet));
    }
    await this.addSignatureToPendingMessage(hash, message);
    return hash;
  }

  private async addSignatureToPendingMessage(hash: string, message: SignedMessage) {
    const pendingMessage = this.executionsStore.get(hash);
    if (pendingMessage.transactionHash !== '0x0') {
      throw new DuplicatedExecution();
    }
    if (pendingMessage.containSignature(message.signature)) {
      throw new DuplicatedSignature();
    }
    const key = utils.verifyMessage(utils.arrayify(calculateMessageHash(message)), message.signature);
    const keyPurpose = await pendingMessage.walletContract.getKeyPurpose(key);
    if (keyPurpose.eq(0)) {
      throw new InvalidSignature('Invalid key purpose');
    }
    pendingMessage.collectedSignatures.push({signature: message.signature, key});
    this.executionsStore.add(hash, pendingMessage);
  }

  async getStatus(hash: string) {
    return this.executionsStore.getStatus(hash);
  }

  getMessageWithSignatures(message: SignedMessage, hash: string) : SignedMessage {
    return  { ...message, signature: this.executionsStore.get(hash).getConcatenatedSignatures()};
  }

  confirmExecution(messageHash: string, transactionHash: string) {
    this.executionsStore.get(messageHash).confirmExecution(transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    this.executionsStore.get(messageHash).ensureCorrectExecution();
  }

  async isEnoughSignatures(hash: string) : Promise<boolean> {
    return this.executionsStore.get(hash).isEnoughSignatures();
  }

  get(hash: string) {
    return this.executionsStore.get(hash);
  }

  remove(hash: string) {
    return this.executionsStore.remove(hash);
  }
}
