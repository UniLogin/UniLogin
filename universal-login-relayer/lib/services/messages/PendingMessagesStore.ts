import {Contract, Wallet} from 'ethers';
import {MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {getKeyFromHashAndSignature} from '../../utils/utils';
import {InvalidMessage} from '../../utils/errors';
import PendingMessage from './PendingMessage';
import IPendingMessagesStore from './IPendingMessagesStore';

export default class PendingMessagesStore implements IPendingMessagesStore {
  public messages: Record<string, PendingMessage>;

  constructor () {
    this.messages = {};
  }

  async add(messageHash: string, pendingMessage: PendingMessage) {
    this.messages[messageHash] = pendingMessage;
  }

  async isPresent(messageHash: string) {
    return messageHash in this.messages;
  }

  throwIfInvalidMessage(messageHash: string) {
    if (!this.messages[messageHash]) {
      throw new InvalidMessage(messageHash);
    }
  }

  async get(messageHash: string): Promise<PendingMessage> {
    this.throwIfInvalidMessage(messageHash);
    return this.messages[messageHash];
  }

  async remove(messageHash: string): Promise<PendingMessage> {
    const pendingExecution = this.messages[messageHash];
    delete this.messages[messageHash];
    return pendingExecution;
  }

  async containSignature(messageHash: string, signature: string) : Promise<boolean> {
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

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.messages[messageHash].collectedSignatureKeyPairs;
  }

  async addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.messages[messageHash].collectedSignatureKeyPairs.push({signature, key});
  }

  async setTransactionHash(messageHash: string, transactionHash: string) {
    this.messages[messageHash].transactionHash = transactionHash;
  }
}
