import {Wallet} from 'ethers';
import {GasComputation} from '../GasComputation';
import {ComposeValidator} from './ComposeValidator';
import {GasValidator} from './GasValidator';
import {RefundReceiverValidator} from './RefundReceiverValidator';

export class MessageHandlerValidator extends ComposeValidator {
  constructor(maxGas: number, gasComputation: GasComputation, wallet: Wallet) {
    super([
      new GasValidator(maxGas, gasComputation),
      new RefundReceiverValidator(wallet),
    ]);
  }
}

export default MessageHandlerValidator;
