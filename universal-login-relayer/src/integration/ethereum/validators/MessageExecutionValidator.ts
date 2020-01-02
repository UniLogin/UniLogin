import {Wallet} from 'ethers';
import {ContractWhiteList, SufficientBalanceValidator} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import CorrectMasterValidator from './CorrectMasterValidator';
import EstimateGasValidator from './EstimateGasValidator';
import {ContractService} from '../ContractService';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList, contractService: ContractService) {
    super([
      new CorrectProxyValidator(wallet.provider, contractWhiteList),
      new CorrectMasterValidator(wallet.provider, contractWhiteList, contractService),
      new SufficientBalanceValidator(wallet.provider),
      new EstimateGasValidator(wallet, contractService),
    ]);
  }
}

export default MessageExecutionValidator;
