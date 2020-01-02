import {Wallet} from 'ethers';
import {ContractWhiteList, SufficientBalanceValidator} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import CorrectMasterValidator from './CorrectMasterValidator';
import EstimateGasValidator from './EstimateGasValidator';
import {WalletContractService} from '../WalletContractService';
import {ContractService} from '../ContractService';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList, walletContractService: WalletContractService, contractService: ContractService) {
    super([
      new CorrectProxyValidator(wallet.provider, contractWhiteList),
      new CorrectMasterValidator(wallet.provider, contractWhiteList, walletContractService),
      new SufficientBalanceValidator(wallet.provider),
      new EstimateGasValidator(wallet, contractService),
    ]);
  }
}

export default MessageExecutionValidator;
