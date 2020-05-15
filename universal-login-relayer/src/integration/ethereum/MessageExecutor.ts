import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensureNotFalsy, IMessageValidator, safeDivide} from '@unilogin/commons';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import IMessageRepository from '../../core/models/messages/IMessagesRepository';
import {TransactionHashNotFound, GasUsedNotFound} from '../../core/utils/errors';
import {IMinedTransactionHandler} from '../../core/models/IMinedTransactionHandler';
import {WalletContractService} from './WalletContractService';
import MessageItem from '../../core/models/messages/MessageItem';
import {GasTokenValidator} from '../../core/services/validators/GasTokenValidator';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

export class MessageExecutor implements IExecutor<MessageItem> {
  constructor(
    private wallet: Wallet,
    private messageValidator: IMessageValidator,
    private messageRepository: IMessageRepository,
    private minedTransactionHandler: IMinedTransactionHandler,
    private walletContractService: WalletContractService,
    private gasTokenValidator: GasTokenValidator,
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Message';
  }

  async validateMessageItem(messageItem: MessageItem) {
    const signedMessage = messageItem.message;
    const {gasPrice, gasToken} = signedMessage;
    let {tokenPriceInEth} = messageItem;
    tokenPriceInEth = tokenPriceInEth || '1';
    this.gasTokenValidator.validate({
      gasPrice: gasPrice.toString(),
      gasToken,
      tokenPriceInETH: tokenPriceInEth,
    }, 0.3);
  }


  async handleExecute(messageHash: string) {
    try {
      const messageItem = await this.messageRepository.get(messageHash);
      this.validateMessageItem(messageItem);
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
    await this.gasTokenValidator.validate({
      gasPrice: signedMessage.gasPrice.toString(),
      gasToken: signedMessage.gasToken,
      tokenPriceInETH: messageItem.tokenPriceInEth,
    }, 0.3);
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage, messageItem.tokenPriceInEth);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
