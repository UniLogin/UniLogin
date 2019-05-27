import {Contract, Wallet} from 'ethers';
import {MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {getKeyFromHashAndSignature} from '../../utils/utils';
import {InvalidExecution} from '../../utils/errors';
import PendingMessage from './PendingMessage';
import IPendingMessagesStore from './IPendingMessagesStore';

export default class PendingMessagesStore implements IPendingMessagesStore {
  public messages: Record<string, PendingMessage>;

  constructor () {
    this.messages = {};
  }

  add(messageHash: string, pendingMessage: PendingMessage) {
    this.messages[messageHash] = pendingMessage;
  }

  isPresent(messageHash: string) {
    return messageHash in this.messages;
  }

  throwIfInvalidMessage(messageHash: string) {
    if (!this.messages[messageHash]) {
      throw new InvalidExecution(messageHash);
    }
  }

  get(messageHash: string): PendingMessage {
    this.throwIfInvalidMessage(messageHash);
    return this.messages[messageHash];
  }

  remove(messageHash: string): PendingMessage {
    const pendingExecution = this.messages[messageHash];
    delete this.messages[messageHash];
    return pendingExecution;
  }

  containSignature(messageHash: string, signature: string) : boolean {
    const message = this.messages[messageHash];
    return !!message && message
      .collectedSignatureKeyPairs
      .filter((collectedSignature) => collectedSignature.signature === signature)
      .length > 0;
  }

  async getStatus(messageHash: string, wallet: Wallet) : Promise<MessageStatus>  {
    this.throwIfInvalidMessage(messageHash);
    const message = this.messages[messageHash];
    const walletContract = new Contract(message.walletAddress, WalletContract.interface, wallet);
    const required = await walletContract.requiredSignatures();
    return {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required,
      transactionHash: message.transactionHash
    };
  }

  getCollectedSignatureKeyPairs(messageHash: string) {
    return this.messages[messageHash].collectedSignatureKeyPairs;
  }

  addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.messages[messageHash].collectedSignatureKeyPairs.push({signature, key});
  }

  updateTransactionHash(messageHash: string, transactionHash: string) {
    this.messages[messageHash].transactionHash = transactionHash;
  }
}
