import {GasComputation} from '../GasComputation';
import {ComposeValidator} from './ComposeValidator';
import {GasValidator} from './GasValidator';
import {RefundReceiverValidator} from './RefundReceiverValidator';

export class MessageHandlerValidator extends ComposeValidator {
  constructor(maxGas: number, gasComputation: GasComputation, walletAddress: string) {
    super([
      new GasValidator(maxGas, gasComputation),
      new RefundReceiverValidator(walletAddress),
    ]);
  }
}

export default MessageHandlerValidator;
