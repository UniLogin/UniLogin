import {Message} from '@universal-login/commons';
import {calculateGasBase} from '@universal-login/contracts';

export class GasComputation {
  calculateGasBase(message: Omit<Message, 'gasLimit'>) {
    return calculateGasBase(message);
  }
}
