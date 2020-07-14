import {Wallet, providers} from 'ethers';
import {ensureNotFalsy, IMessageValidator} from '@unilogin/commons';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import IMessageRepository from '../../core/models/messages/IMessagesRepository';
import {TransactionHashNotFound, GasUsedNotFound} from '../../core/utils/errors';
import {IMinedTransactionHandler} from '../../core/models/IMinedTransactionHandler';
import {WalletContractService} from './WalletContractService';
import {GasTokenValidator} from '../../core/services/validators/GasTokenValidator';
import MessageItem from '../../core/models/messages/MessageItem';
import EstimateGasValidator from './validators/EstimateGasValidator';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

export class MessageExecutor implements IExecutor<MessageItem> {
  constructor(
    private wallet: Wallet,
    private messageValidator: IMessageValidator,
    private messageRepository: IMessageRepository,
    private minedTransactionHandler: IMinedTransactionHandler,
    private walletContractService: WalletContractService,
    private gasTokenValidator: GasTokenValidator,
    private estimateGasValidator: EstimateGasValidator,
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Message';
  }

  async handleExecute(messageHash: string) {
    try {
      const messageItem = await this.messageRepository.get(messageHash);
      const transactionResponse = await this.execute(messageItem);
      const {hash, wait, gasPrice} = transactionResponse;
      ensureNotFalsy(hash, TransactionHashNotFound);
      await this.messageRepository.markAsPending(messageHash, hash!, gasPrice.toString());
      const {gasUsed} = await wait();
      await this.minedTransactionHandler.handle(transactionResponse);
      ensureNotFalsy(gasUsed, GasUsedNotFound);
      await this.messageRepository.markAsSuccess(messageHash, gasUsed.toString());
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.messageRepository.markAsError(messageHash, errorMessage);
    }
  }

  async execute(messageItem: MessageItem): Promise<providers.TransactionResponse> {
    const signedMessage = messageItem.message;
    await this.messageValidator.validate(signedMessage);
    await this.estimateGasValidator.validate(signedMessage, messageItem.tokenPriceInEth.toString());
    await this.gasTokenValidator.validate({
      gasPrice: signedMessage.gasPrice.toString(),
      gasToken: signedMessage.gasToken,
      tokenPriceInETH: messageItem.tokenPriceInEth.toString(),
    }, 0.3, 'cheap');
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage, messageItem.tokenPriceInEth);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
