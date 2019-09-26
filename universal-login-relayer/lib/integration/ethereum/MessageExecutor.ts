import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import IMessageValidator from '../../core/services/validators/IMessageValidator';
import {messageToTransaction} from '../../core/utils/messages/serialisation';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/services/execution/IExecutor';

export class MessageExecutor implements IExecutor<SignedMessage> {

  constructor(private wallet: Wallet, private messageValidator: IMessageValidator) {
  }

  canExecute(item: QueueItem): boolean {
    return item.type === 'Message';
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    await this.messageValidator.validate(signedMessage);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    return this.wallet.sendTransaction(transactionReq);
  }
}

export default MessageExecutor;
