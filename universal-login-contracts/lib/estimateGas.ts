import {utils} from 'ethers';
import {UnsignedMessage, SignedMessage, computeGasBase, createFullHexString, ensure, SignedMessagePaymentOptions} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';
import cloneDeep from 'lodash.clonedeep';

export const computeGasFields = (unsignedMessage: UnsignedMessage, gasLimit: utils.BigNumberish) => {
  const gasBase = utils.bigNumberify(estimateGasBaseFromUnsignedMessage(unsignedMessage));
  const gasCall = calculateGasCall(gasLimit, gasBase);
  return {gasBase, gasCall};
};

export const calculateGasCall = (gasLimit: utils.BigNumberish, gasBase: utils.BigNumberish) => {
  const gasCall = utils.bigNumberify(gasLimit).sub(gasBase);
  ensure(gasCall.gt(0), Error, 'Gas limit too low');
  return gasCall;
};

export const estimateGasBaseFromUnsignedMessage = (unsignedMessage: UnsignedMessage) => {
  const signature = createFullHexString(65);
  return estimateGasBaseFromSignedMessage({...unsignedMessage, signature});
};

export const estimateGasBaseFromSignedMessage = (signedMessage: SignedMessage) => {
  const copySignedMessage = {...cloneDeep(signedMessage), gasBase: utils.bigNumberify('0xFFFFFF'), gasCall: utils.bigNumberify('0xFFFFFF')};
  const txdata = encodeDataForExecuteSigned(copySignedMessage);
  return computeGasBase(txdata);
};

export const calculateFinalGasLimit = (gasCall: utils.BigNumberish, gasBase: utils.BigNumberish) =>
  utils.bigNumberify(gasCall).add(gasBase).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.gasCall, msg.gasBase)});
