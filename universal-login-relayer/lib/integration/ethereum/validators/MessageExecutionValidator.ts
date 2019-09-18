import {Wallet} from 'ethers';
import {ContractWhiteList} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import EnoughTokenValidator from './EnoughTokenValidator';
import EnoughGasValidator from './EnoughGasValidator';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList) {
    super([
      new CorrectProxyValidator(wallet, contractWhiteList),
      new EnoughTokenValidator(wallet),
      new EnoughGasValidator(wallet)
    ]);
  }
}

export default MessageExecutionValidator;
