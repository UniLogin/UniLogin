import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import IMessageValidator from '../../core/services/validators/IMessageValidator';
import {messageToTransaction} from '../../core/utils/messages/serialisation';

export class MessageExecutor {

  constructor(private wallet: Wallet, private messageValidator: IMessageValidator) {
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    await this.messageValidator.validate(signedMessage);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
