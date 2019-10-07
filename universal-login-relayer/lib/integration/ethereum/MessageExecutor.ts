import {Wallet, providers} from 'ethers';
import {SignedMessage, ensureNotNull} from '@universal-login/commons';
import IMessageValidator from '../../core/services/validators/IMessageValidator';
import {messageToTransaction} from '../../core/utils/messages/serialisation';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/services/execution/IExecutor';
import IMessageRepository from '../../core/services/messages/IMessagesRepository';
import {TransactionHashNotFound} from '../../core/utils/errors';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

export class MessageExecutor implements IExecutor<SignedMessage> {

  constructor(
    private wallet: Wallet,
    private messageValidator: IMessageValidator,
    private messageRepository: IMessageRepository,
    private onTransactionMined: OnTransactionMined,
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Message';
  }

  async handleExecute(messageHash: string) {
    try {
      const signedMessage = await this.messageRepository.getMessage(messageHash);
      const transactionResponse = await this.execute(signedMessage);
      const {hash, wait} = transactionResponse;
      ensureNotNull(hash, TransactionHashNotFound);
      await this.messageRepository.markAsPending(messageHash, hash!);
      await wait();
      await this.onTransactionMined(transactionResponse);
      await this.messageRepository.setMessageState(messageHash, 'Success');
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.messageRepository.markAsError(messageHash, errorMessage);
    }
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    await this.messageValidator.validate(signedMessage);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
