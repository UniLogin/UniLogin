import {GasComputation} from '../GasComputation';
import {ComposeValidator} from './ComposeValidator';
import {GasValidator} from './GasValidator';
import {RefundReceiverValidator} from './RefundReceiverValidator';
import {SupportedTokensValidator} from './SupportedTokensValidator';
import {SupportedToken} from '@unilogin/commons';

export class MessageHandlerValidator extends ComposeValidator {
  constructor(maxGas: number, gasComputation: GasComputation, walletAddress: string, supportedTokens: SupportedToken[]) {
    super([
      new GasValidator(maxGas, gasComputation),
      new RefundReceiverValidator(walletAddress),
      new SupportedTokensValidator(supportedTokens),
    ]);
  }
}

export default MessageHandlerValidator;
