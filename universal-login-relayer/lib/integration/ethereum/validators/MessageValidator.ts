import {Wallet, providers} from 'ethers';
import {ContractWhiteList, SignedMessage} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from '../../../integration/ethereum/validators/CorrectProxyValidator';
import {ensureEnoughGas, ensureEnoughToken} from '../validations';
import {messageToTransaction} from '../../../core/utils/messages/serialisation';

export class MessageValidator extends ComposeValidator {
  constructor(private wallet: Wallet, contractWhiteList: ContractWhiteList) {
    super([
      new CorrectProxyValidator(wallet, contractWhiteList)
    ]);
  }

  async validate(signedMessage: SignedMessage) : Promise<void> {
    await super.validate(signedMessage);

    await ensureEnoughToken(this.wallet.provider, signedMessage);

    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await ensureEnoughGas(this.wallet.provider, this.wallet.address, transactionReq, signedMessage);
  }
}

export default MessageValidator;
