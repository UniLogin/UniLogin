import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {messageToTransaction} from '../../core/utils/utils';
import {OnTransactionSent} from '../../core/services/messages/QueueService';
import MessageValidator from '../../core/services/messages/MessageValidator';

export class MessageExecutor {

  constructor(private wallet: Wallet, private onTransactionSent: OnTransactionSent, private messageValidator: MessageValidator) {
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await this.messageValidator.validate(signedMessage, transactionReq);
    return this.wallet.sendTransaction(transactionReq);
  }

  async waitAndHandleTransaction(transactionResponse: providers.TransactionResponse) {
    await transactionResponse.wait();
    await this.onTransactionSent(transactionResponse);
  }
}

export default MessageExecutor;
