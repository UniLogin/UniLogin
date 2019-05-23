import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {messageToTransaction} from '../../utils/utils';
import {ensureEnoughToken, ensureEnoughGas} from './validations';
import {OnTransactionSent} from '../transactions/TransactionQueueService';
import MessageValidator from './MessageValidator';

export class MessageExecutor {
  private messageValidator: MessageValidator;

  constructor(private wallet: Wallet, private onTransactionSent: OnTransactionSent) {
    this.messageValidator = new MessageValidator(wallet);
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await this.messageValidator.validate(signedMessage, transactionReq);
    const transactionRes: providers.TransactionResponse = await this.wallet.sendTransaction(transactionReq);
    this.onTransactionSent(transactionRes);
    return transactionRes;
  }
}

export default MessageExecutor;
