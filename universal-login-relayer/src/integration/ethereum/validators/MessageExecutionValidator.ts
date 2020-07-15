import {ContractWhiteList, ProviderService, SufficientBalanceValidator} from '@unilogin/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import CorrectMasterValidator from './CorrectMasterValidator';
import {WalletContractService} from '../WalletContractService';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(providerService: ProviderService, contractWhiteList: ContractWhiteList, walletContractService: WalletContractService) {
    super([
      new CorrectProxyValidator(providerService, contractWhiteList),
      new CorrectMasterValidator(providerService, contractWhiteList, walletContractService),
      new SufficientBalanceValidator(providerService),
    ]);
  }
}

export default MessageExecutionValidator;
