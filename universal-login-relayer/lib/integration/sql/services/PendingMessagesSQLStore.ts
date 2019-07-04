import Knex from 'knex';
import {Wallet, Contract} from 'ethers';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {getKeyFromHashAndSignature} from '../../../core/utils/utils';
import {InvalidMessage} from '../../../core/utils/errors';
import IPendingMessagesStore from '../../../core/services/messages/IPendingMessagesStore';
import PendingMessage from '../../../core/models/messages/PendingMessage';

export class PendingMessagesSQLStore implements IPendingMessagesStore {
  constructor(public knex: Knex) {
  }

  async add(messageHash: string, pendingMessage: PendingMessage) {
    return this.knex
      .insert({
        messageHash,
        transactionHash: pendingMessage.transactionHash,
        walletAddress: pendingMessage.walletAddress,
        createdAt: this.knex.fn.now()
      })
      .into('messages');
  }

  async get(messageHash: string) {
    const message = await this.getMessage(messageHash);
    if (!message) {
      throw new InvalidMessage(messageHash);
    }
    const signatureKeyPairs = await this.getCollectedSignatureKeyPairs(messageHash);
    const pendingMessage: PendingMessage = message && {
      transactionHash: message.transactionHash,
      walletAddress: message.walletAddress,
      collectedSignatureKeyPairs: signatureKeyPairs
    };
    return pendingMessage;
  }

  private getMessage(messageHash: string) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .first();
  }

  async isPresent(messageHash: string) {
    const message = await this.getMessage(messageHash);
    const signatureKeyPairs = await this.knex('signature_key_pairs')
      .where('messageHash', messageHash);
    return !!message || signatureKeyPairs.length !== 0;
  }

  async remove(messageHash: string) {
    const pendingMessage: PendingMessage = await this.get(messageHash);
    await this.knex('signature_key_pairs')
      .delete()
      .where('messageHash', messageHash);
    await this.knex('messages')
      .delete()
      .where('messageHash', messageHash);
    return pendingMessage;
  }

  async getStatus(messageHash: string, wallet: Wallet) {
    const message = await this.get(messageHash);
    const walletContract = new Contract(message.walletAddress, WalletContract.interface, wallet);
    const required = await walletContract.requiredSignatures();
    return {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required,
      transactionHash: message.transactionHash
    };
  }

  async addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    await this.knex
      .insert({
        messageHash,
        signature,
        key
      })
      .into('signature_key_pairs');
  }

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.knex('signature_key_pairs')
      .where('messageHash', messageHash)
      .select(['key', 'signature']);
  }

  async setTransactionHash(messageHash: string, transactionHash: string) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .update('transactionHash', transactionHash);
  }

  async containSignature(messageHash: string, signature: string) {
    const foundSignature = await this.knex('signature_key_pairs')
      .where('messageHash', messageHash)
      .andWhere('signature', signature)
      .first();
    return !!foundSignature;
  }

}

export default PendingMessagesSQLStore;
