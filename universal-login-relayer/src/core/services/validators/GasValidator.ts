import {SignedMessage, ensure, GAS_BASE, IMessageValidator} from '@unilogin/commons';
import {InsufficientGas, GasLimitTooHigh} from '../../utils/errors';
import {GasComputation} from '../GasComputation';
import {utils} from 'ethers';

export class GasValidator implements IMessageValidator {
  constructor(private MAX_GAS_LIMIT: number, private gasComputation: GasComputation) {}

  async validate(signedMessage: SignedMessage) {
    const {signature, ...unsignedMessage} = signedMessage;
    const expectedBaseGas = utils.bigNumberify(await this.gasComputation.calculateBaseGas(unsignedMessage));
    const actualBaseGas = Number(signedMessage.baseGas);
    ensure(expectedBaseGas.eq(actualBaseGas), InsufficientGas, `Got baseGas ${actualBaseGas} but should be ${expectedBaseGas}`);
    ensure(GAS_BASE < signedMessage.safeTxGas, InsufficientGas, `Got safeTxGas ${signedMessage.safeTxGas} but should greater than ${GAS_BASE}`);

    const safeTxGas = Number(signedMessage.safeTxGas);
    const totalGasLimit = safeTxGas + actualBaseGas;
    ensure(totalGasLimit <= this.MAX_GAS_LIMIT, GasLimitTooHigh, `Got ${totalGasLimit} but should be less than ${this.MAX_GAS_LIMIT}`);
  }
}
