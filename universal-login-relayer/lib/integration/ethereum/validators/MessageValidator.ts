import {Wallet} from 'ethers';
import {ContractWhiteList} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from '../../../integration/ethereum/validators/CorrectProxyValidator';
import EnoughTokenValidator from '../../../integration/ethereum/validators/EnoughTokenValidator';
import EnoughGasValidator from '../../../integration/ethereum/validators/EnoughGasValidator';

export class MessageValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList) {
    super([
      new CorrectProxyValidator(wallet, contractWhiteList),
      new EnoughTokenValidator(wallet),
      new EnoughGasValidator(wallet)
    ]);
  }
}

export default MessageValidator;
