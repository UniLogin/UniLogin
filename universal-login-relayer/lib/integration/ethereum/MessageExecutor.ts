import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import MessageValidator from './validators/MessageValidator';
import {messageToTransaction} from '../../core/utils/messages/serialisation';

export class MessageExecutor {

  constructor(private wallet: Wallet, private messageValidator: MessageValidator) {
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await this.messageValidator.validate(signedMessage, transactionReq);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
