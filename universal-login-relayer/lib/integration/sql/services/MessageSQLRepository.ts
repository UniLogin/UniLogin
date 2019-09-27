import Knex from 'knex';
import {stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotNull, getMessageWithSignatures, MessageState} from '@universal-login/commons';
import {getKeyFromHashAndSignature} from '../../../core/utils/encodeData';
import IMessageRepository from '../../../core/services/messages/IMessagesRepository';
import {InvalidMessage, MessageNotFound} from '../../../core/utils/errors';
import MessageItem from '../../../core/models/messages/MessageItem';
import {ensureProperTransactionHash} from '../../../core/utils/validations';
import SQLRepository from './SQLRepository';

export class MessageSQLRepository extends SQLRepository<MessageItem> implements IMessageRepository {
  constructor(public knex: Knex) {
    super(knex, 'messages');
  }

  // Override
  async add(messageHash: string, messageItem: MessageItem) {
    ensureNotNull(messageItem.message, MessageNotFound, messageHash);
    await super.add(messageHash, {
        transactionHash: messageItem.transactionHash,
        walletAddress: messageItem.walletAddress,
        state: 'AwaitSignature',
        message: stringifySignedMessageFields(messageItem.message)
    } as MessageItem
    );
  }

  // Override
  async get(messageHash: string) {
    const message = await this.getMessageEntry(messageHash);
    if (!message) {
      throw new InvalidMessage(messageHash);
    }
    if (message.message) {
      message.message = bignumberifySignedMessageFields(message.message);
    }
    const signatureKeyPairs = await this.getCollectedSignatureKeyPairs(messageHash);
    const messageItem: MessageItem = message && {
      ...message,
      collectedSignatureKeyPairs: signatureKeyPairs
    };
    return messageItem;
  }

  private async getMessageEntry(messageHash: string) {
    return this.knex(this.tableName)
      .where('hash', messageHash)
      .columns(['transactionHash', 'error', 'walletAddress', 'message', 'state'])
      .first();
  }

  // Override
  async isPresent(messageHash: string) {
    const message = await this.getMessageEntry(messageHash);
    const signatureKeyPairs = await this.knex('signature_key_pairs')
      .where('messageHash', messageHash);
    return !!message || signatureKeyPairs.length !== 0;
  }

  // Override
  async remove(messageHash: string) {
    const messageItem: MessageItem = await this.get(messageHash);
    await this.knex('signature_key_pairs')
      .delete()
      .where('messageHash', messageHash);
    await super.remove(messageHash);
    return messageItem;
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

  async setMessageState(messageHash: string, state: MessageState) {
    return this.knex(this.tableName)
      .where('hash', messageHash)
      .update('state', state);
  }

  async markAsPending(messageHash: string, transactionHash: string) {
    ensureProperTransactionHash(transactionHash);
    return this.knex(this.tableName)
      .where('hash', messageHash)
      .update('transactionHash', transactionHash)
      .update('state', 'Pending');
  }

  async markAsError(messageHash: string, error: string) {
    return this.knex(this.tableName)
      .where('hash', messageHash)
      .update('error', error)
      .update('state', 'Error');
  }

  async containSignature(messageHash: string, signature: string) {
    const foundSignature = await this.knex('signature_key_pairs')
      .where('messageHash', messageHash)
      .andWhere('signature', signature)
      .first();
    return !!foundSignature;
  }

  async getMessage(messageHash: string) {
    const message = (await this.get(messageHash)).message;
    ensureNotNull(message, MessageNotFound, messageHash);
    const collectedSignatureKeyPairs = await this.getCollectedSignatureKeyPairs(messageHash);
    return getMessageWithSignatures(message, collectedSignatureKeyPairs);
  }
}

export default MessageSQLRepository;
