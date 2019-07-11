import {Contract, Wallet} from 'ethers';
import {MessageStatus, SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {getKeyFromHashAndSignature} from '../../lib/core/utils/utils';
import {InvalidMessage, SignedMessageNotFound} from '../../lib/core/utils/errors';
import PendingMessage from '../../lib/core/models/messages/PendingMessage';
import IPendingMessagesStore from '../../lib/core/services/messages/IPendingMessagesStore';

export default class PendingMessagesMemoryStore implements IPendingMessagesStore {
  public messages: Record<string, PendingMessage>;

  constructor () {
    this.messages = {};
  }

  async add(messageHash: string, pendingMessage: PendingMessage) {
    ensureNotNull(pendingMessage.message, SignedMessageNotFound, messageHash);
    pendingMessage.message = bignumberifySignedMessageFields(stringifySignedMessageFields(pendingMessage.message));
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
    const status: MessageStatus = {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required: required.toNumber(),
      state: message.state
    };
    const {error, transactionHash} = message;
    if (error) {
      status.error = error;
    }
    if (transactionHash) {
      status.transactionHash = transactionHash;
    }
    return status;
  }

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.messages[messageHash].collectedSignatureKeyPairs;
  }

  async addSignedMessage(messageHash: string, signedMessage: SignedMessage) {
    this.messages[messageHash].message = bignumberifySignedMessageFields(stringifySignedMessageFields(signedMessage));
  }

  async getSignedMessage(messageHash: string) {
    const message = (await this.get(messageHash)).message;
    ensureNotNull(message, SignedMessageNotFound, messageHash);
    return message as SignedMessage;
  }

  async addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.messages[messageHash].collectedSignatureKeyPairs.push({signature, key});
  }

  async markAsSuccess(messageHash: string, transactionHash: string) {
    this.messages[messageHash].transactionHash = transactionHash;
  }

  async markAsError(messageHash: string, error: string) {
    this.messages[messageHash].error = error;
  }
}
