import {utils} from 'ethers';
import {SignedMessagePaymentOptions, createFullHexString, GasDataComputation, CURRENT_NETWORK_VERSION, GAS_FIXED, UnsignedMessage} from '@unilogin/commons';
import {encodeDataForExecuteSigned} from '../../src';

export const calculateFinalGasLimit = (safeTxGas: utils.BigNumberish, baseGas: utils.BigNumberish) =>
  utils.bigNumberify(safeTxGas).add(baseGas).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.safeTxGas, msg.baseGas)});

export const estimateBaseGasForNoSignature = (unsignedMessage: UnsignedMessage) => {
  const encodedMessage = encodeDataForExecuteSigned({
    ...unsignedMessage,
    safeTxGas: createFullHexString(3),
    baseGas: createFullHexString(3),
    signature: '0x0',
  });
  const gasData = new GasDataComputation(CURRENT_NETWORK_VERSION).computeGasData(encodedMessage);
  return utils.bigNumberify(gasData).add(GAS_FIXED);
};
