import Knex from 'knex';
import {Wallet, Contract} from 'ethers';
import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotNull, MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {getKeyFromHashAndSignature} from '../../../core/utils/utils';
import {InvalidMessage, SignedMessageNotFound} from '../../../core/utils/errors';
import IPendingMessagesStore from '../../../core/services/messages/IPendingMessagesStore';
import PendingMessage from '../../../core/models/messages/PendingMessage';

export class PendingMessagesSQLStore implements IPendingMessagesStore {
  constructor(public knex: Knex) {
  }

  async add(messageHash: string, pendingMessage: PendingMessage) {
    ensureNotNull(pendingMessage.message, SignedMessageNotFound, messageHash);
    return this.knex
      .insert({
        messageHash,
        transactionHash: pendingMessage.transactionHash,
        walletAddress: pendingMessage.walletAddress,
        createdAt: this.knex.fn.now(),
        state: pendingMessage.state,
        message: stringifySignedMessageFields(pendingMessage.message)
      })
      .into('messages');
  }

  async get(messageHash: string) {
    const message = await this.getMessage(messageHash);
    if (!message) {
      throw new InvalidMessage(messageHash);
    }
    if (message.message) {
      message.message = bignumberifySignedMessageFields(message.message);
    }
    const signatureKeyPairs = await this.getCollectedSignatureKeyPairs(messageHash);
    const pendingMessage: PendingMessage = message && {
      ...message,
      collectedSignatureKeyPairs: signatureKeyPairs
    };
    return pendingMessage;
  }

  private getMessage(messageHash: string) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .columns(['transactionHash', 'error', 'walletAddress', 'message', 'state'])
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
    const status: MessageStatus =  {
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

  async markAsSuccess(messageHash: string, transactionHash: string) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .update('transactionHash', transactionHash);
  }

  async markAsError(messageHash: string, error: string) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .update('error', error);
  }

  async containSignature(messageHash: string, signature: string) {
    const foundSignature = await this.knex('signature_key_pairs')
      .where('messageHash', messageHash)
      .andWhere('signature', signature)
      .first();
    return !!foundSignature;
  }

  async addSignedMessage(messageHash: string, signedMessage: SignedMessage) {
    return this.knex('messages')
      .where('messageHash', messageHash)
      .update({message: stringifySignedMessageFields(signedMessage)});
  }

  async getSignedMessage(messageHash: string) {
    const signedMessage = (await this.get(messageHash)).message;
    ensureNotNull(signedMessage, SignedMessageNotFound, messageHash);
    return signedMessage as SignedMessage;
  }

}

export default PendingMessagesSQLStore;
