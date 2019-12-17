import {utils} from 'ethers';
import {SignedMessagePaymentOptions} from '@universal-login/commons';

export const calculateFinalGasLimit = (safeTxGas: utils.BigNumberish, baseGas: utils.BigNumberish) =>
  utils.bigNumberify(safeTxGas).add(baseGas).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.safeTxGas, msg.baseGas)});
