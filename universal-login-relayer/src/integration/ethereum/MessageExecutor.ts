import {Wallet, providers} from 'ethers';
import {SignedMessage, ensureNotFalsy, IMessageValidator} from '@unilogin/commons';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import IMessageRepository from '../../core/models/messages/IMessagesRepository';
import {TransactionHashNotFound} from '../../core/utils/errors';
import {IMinedTransactionHandler} from '../../core/models/IMinedTransactionHandler';
import {WalletContractService} from './WalletContractService';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

export class MessageExecutor implements IExecutor<SignedMessage> {
  constructor(
    private wallet: Wallet,
    private messageValidator: IMessageValidator,
    private messageRepository: IMessageRepository,
    private minedTransactionHandler: IMinedTransactionHandler,
    private walletContractService: WalletContractService,
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Message';
  }

  async handleExecute(messageHash: string) {
    try {
      const signedMessage = await this.messageRepository.getMessage(messageHash);
      const transactionResponse = await this.execute(signedMessage);
      const {hash, wait} = transactionResponse;
      ensureNotFalsy(hash, TransactionHashNotFound);
      await this.messageRepository.markAsPending(messageHash, hash!);
      await wait();
      await this.minedTransactionHandler.handle(transactionResponse);
      await this.messageRepository.setState(messageHash, 'Success');
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.messageRepository.markAsError(messageHash, errorMessage);
    }
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    await this.messageValidator.validate(signedMessage);
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
