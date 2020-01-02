import {Wallet} from 'ethers';
import {ContractWhiteList, SufficientBalanceValidator} from '@universal-login/commons';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
import CorrectProxyValidator from './CorrectProxyValidator';
import CorrectMasterValidator from './CorrectMasterValidator';
import EstimateGasValidator from './EstimateGasValidator';
import {WalletContractService} from '../WalletContractService';
import {MessageConverter} from '../MessageConverter';

export class MessageExecutionValidator extends ComposeValidator {
  constructor(wallet: Wallet, contractWhiteList: ContractWhiteList, walletContractService: WalletContractService, messageConverter: MessageConverter) {
    super([
      new CorrectProxyValidator(wallet.provider, contractWhiteList),
      new CorrectMasterValidator(wallet.provider, contractWhiteList, walletContractService),
      new SufficientBalanceValidator(wallet.provider),
      new EstimateGasValidator(wallet, walletContractService, messageConverter),
    ]);
  }
}

export default MessageExecutionValidator;
