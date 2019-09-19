import {Wallet} from 'ethers';
import {ContractWhiteList} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import CorrectMasterValidator from './CorrectMasterValidator';
import EnoughTokenValidator from './EnoughTokenValidator';
import EstimateGasValidator from './EstimateGasValidator';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList) {
    super([
      new CorrectProxyValidator(wallet, contractWhiteList),
      new CorrectMasterValidator(wallet, contractWhiteList),
      new EnoughTokenValidator(wallet),
      new EstimateGasValidator(wallet)
    ]);
  }
}

export default MessageExecutionValidator;
