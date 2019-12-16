import {Wallet} from 'ethers';
import {GasComputation} from '../../services/GasComputation';
import {ComposeValidator} from '../../../core/services/validators/ComposeValidator';
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
