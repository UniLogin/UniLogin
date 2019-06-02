import {SignedMessage} from '@universal-login/commons';
import {Wallet, providers} from 'ethers';
import {ensureEnoughGas, ensureEnoughToken} from './validations';

export class MessageValidator {
  constructor(private wallet: Wallet) {
  }

  async validate(signedMessage: SignedMessage, transactionReq: providers.TransactionRequest) : Promise<void> {
    await ensureEnoughToken(this.wallet.provider, signedMessage);
    await ensureEnoughGas(this.wallet.provider, this.wallet.address, transactionReq, signedMessage);
  }
}

export default MessageValidator;
