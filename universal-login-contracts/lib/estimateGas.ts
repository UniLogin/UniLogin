import {utils} from 'ethers';
import {UnsignedMessage, SignedMessage, computeGasData, createFullHexString, ensure, SignedMessagePaymentOptions} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';
import cloneDeep from 'lodash.clonedeep';

export const computeGasFields = (unsignedMessage: UnsignedMessage, gasLimit: utils.BigNumberish) => {
  const gasData = utils.bigNumberify(estimateGasDataFromUnsignedMessage(unsignedMessage));
  const gasCall = calculategasCall(gasLimit, gasData);
  return {gasData, gasCall};
};

export const calculategasCall = (gasLimit: utils.BigNumberish, gasData: utils.BigNumberish) => {
  const gasCall = utils.bigNumberify(gasLimit).sub(gasData);
  ensure(gasCall.gt(0), Error, 'Gas limit too low');
  return gasCall;
};

export const estimateGasDataFromUnsignedMessage = (unsignedMessage: UnsignedMessage) => {
  const signature = createFullHexString(65);
  return estimateGasDataFromSignedMessage({...unsignedMessage, signature});
};

export const estimateGasDataFromSignedMessage = (signedMessage: SignedMessage) => {
  const copySignedMessage = {...cloneDeep(signedMessage), gasData: utils.bigNumberify('0xFFFFFF'), gasCall: utils.bigNumberify('0xFFFFFF')};
  const txdata = encodeDataForExecuteSigned(copySignedMessage);
  return computeGasData(txdata);
};

export const calculateFinalGasLimit = (gasCall: utils.BigNumberish, gasData: utils.BigNumberish) =>
  utils.bigNumberify(gasCall).add(gasData).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.gasCall, msg.gasData)});
