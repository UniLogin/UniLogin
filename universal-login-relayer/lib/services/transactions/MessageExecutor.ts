import {Wallet, providers} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {messageToTransaction} from '../../utils/utils';
import {ensureEnoughToken, ensureEnoughGas} from '../messages/validations';
import { OnTransactionSent } from './TransactionQueueService';

export class MessageExecutor {

  constructor(private wallet: Wallet, private onTransactionSent: OnTransactionSent) {
  }

  async execute(signedMessage: SignedMessage): Promise<providers.TransactionResponse> {
    await ensureEnoughToken(this.wallet.provider, signedMessage);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await ensureEnoughGas(this.wallet.provider, this.wallet.address, transactionReq, signedMessage);
    const transactionRes: providers.TransactionResponse = await this.wallet.sendTransaction(transactionReq);
    this.onTransactionSent(transactionRes);
    return transactionRes;
  }
}

export default MessageExecutor;
