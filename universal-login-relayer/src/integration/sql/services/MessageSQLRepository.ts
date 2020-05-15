import Knex from 'knex';
import {stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotFalsy, getSignatureFrom} from '@unilogin/commons';
import IMessageRepository from '../../../core/models/messages/IMessagesRepository';
import {InvalidMessage, MessageNotFound} from '../../../core/utils/errors';
import MessageItem from '../../../core/models/messages/MessageItem';
import SQLRepository from './SQLRepository';

export class MessageSQLRepository extends SQLRepository<MessageItem> implements IMessageRepository {
  constructor(public knex: Knex) {
    super(knex, 'messages');
  }

  // Override
  async add(messageHash: string, messageItem: MessageItem) {
    ensureNotFalsy(messageItem.message, MessageNotFound, messageHash);
    await super.add(messageHash, {
      transactionHash: messageItem.transactionHash,
      walletAddress: messageItem.walletAddress,
      state: 'AwaitSignature',
      message: stringifySignedMessageFields(messageItem.message),
      refundPayerId: messageItem.refundPayerId,
      tokenPriceInEth: messageItem.tokenPriceInEth,
    } as MessageItem,
    );
  }

  // Override
  async get(messageHash: string) {
    const messageEntry = await this.getMessageEntry(messageHash);
    ensureNotFalsy(messageEntry, InvalidMessage, messageHash);
    const collectedSignatureKeyPairs = await this.getCollectedSignatureKeyPairs(messageHash);
    if (messageEntry.message) {
      const signature = await getSignatureFrom(collectedSignatureKeyPairs);
      messageEntry.message = {...bignumberifySignedMessageFields(messageEntry.message), signature};
    }
    const messageItem: MessageItem = messageEntry && {
      ...messageEntry,
      collectedSignatureKeyPairs,
    };
    return messageItem;
  }

  private async getMessageEntry(messageHash: string) {
    return this.knex(this.tableName)
      .where('hash', messageHash)
      .columns(['transactionHash', 'error', 'walletAddress', 'message', 'state', 'refundPayerId', 'gasPriceUsed', 'gasUsed', 'tokenPriceInEth'])
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
      .where('messageHash', messageHash)
      .del();
    await super.remove(messageHash);
    return messageItem;
  }

  async addSignature(messageHash: string, signature: string, key: string) {
    await this.knex
      .insert({
        messageHash,
        signature,
        key,
      })
      .into('signature_key_pairs');
  }

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.knex('signature_key_pairs')
      .where('messageHash', messageHash)
      .select(['key', 'signature']);
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
    ensureNotFalsy(message, MessageNotFound, messageHash);
    return message;
  }
}

export default MessageSQLRepository;
