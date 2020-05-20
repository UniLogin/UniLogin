import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensureNotFalsy, IMessageValidator, ensure} from '@unilogin/commons';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import IMessageRepository from '../../core/models/messages/IMessagesRepository';
import {TransactionHashNotFound, GasUsedNotFound} from '../../core/utils/errors';
import {IMinedTransactionHandler} from '../../core/models/IMinedTransactionHandler';
import {WalletContractService} from './WalletContractService';
import {GasTokenValidator} from '../../core/services/validators/GasTokenValidator';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

export class MessageExecutor implements IExecutor<SignedMessage> {
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

  async handleExecute(messageHash: string) {
    try {
      const messageItem = await this.messageRepository.get(messageHash);
      const signedMessage = messageItem.message;
      const tokenPriceInEth = messageItem.tokenPriceInEth;
      const transactionResponse = await this.execute(signedMessage, tokenPriceInEth);
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

  async execute(signedMessage: SignedMessage, tokenPriceInEth?: utils.BigNumberish): Promise<providers.TransactionResponse> {
    await this.messageValidator.validate(signedMessage);
    ensure(tokenPriceInEth !== undefined, Error, 'Undefined tokenPriceInEth');
    await this.gasTokenValidator.validate({
      gasPrice: signedMessage.gasPrice.toString(),
      gasToken: signedMessage.gasToken,
      tokenPriceInETH: tokenPriceInEth.toString(),
    }, 0.3);
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage, tokenPriceInEth);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
