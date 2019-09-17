import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {messageToTransaction} from '../../core/utils/utils';
import IMessageValidator from '../../core/services/validators/IMessageValidator';

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
