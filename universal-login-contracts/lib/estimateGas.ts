import {utils} from 'ethers';
import {createFullHexString, ensure, SignedMessagePaymentOptions, Message, computeGasData, GAS_FIXED} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';

export const calculateGasCall = (gasLimit: utils.BigNumberish, gasBase: utils.BigNumberish) => {
  const gasCall = utils.bigNumberify(gasLimit).sub(gasBase);
  ensure(gasCall.gt(0), Error, 'Gas limit too low');
  return gasCall;
};

export const calculateFinalGasLimit = (gasCall: utils.BigNumberish, gasBase: utils.BigNumberish) =>
  utils.bigNumberify(gasCall).add(gasBase).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.gasCall, msg.gasBase)});

export const calculateGasBase = (message: Omit<Message, 'gasLimit'>) => {
  const encodedMessage = encodeDataForExecuteSigned({
    ...message,
    gasCall: createFullHexString(3),
    gasBase: createFullHexString(3),
    signature: createFullHexString(65),
  });
  const gasData = computeGasData(encodedMessage);
  return utils.bigNumberify(gasData).add(GAS_FIXED);
};
