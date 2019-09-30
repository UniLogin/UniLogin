import {utils} from 'ethers';
import {UnsignedMessage, SignedMessage, computeGasData, createFullHexString, ensure} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';
import cloneDeep from 'lodash.clonedeep';

export const computeGasFields = (unsignedMessage: UnsignedMessage, gasLimit: utils.BigNumberish) => {
  const gasData = utils.bigNumberify(estimateGasDataFromUnsignedMessage(unsignedMessage));
  const gasLimitExecution = calculateGasLimitExecution(gasLimit, gasData);
  return {gasData, gasLimitExecution};
};

export const calculateGasLimitExecution = (gasLimit: utils.BigNumberish, gasData: utils.BigNumberish) => {
  const gasLimitExecution = utils.bigNumberify(gasLimit).sub(gasData);
  ensure(gasLimitExecution.gt(0), Error, 'Gas limit too low');
  return gasLimitExecution;
};

export const estimateGasDataFromUnsignedMessage = (unsignedMessage: UnsignedMessage) => {
  const signature = createFullHexString(65);
  return estimateGasDataFromSignedMessage({...unsignedMessage, signature});
};

export const estimateGasDataFromSignedMessage = (signedMessage: SignedMessage) => {
  const copySignedMessage = {...cloneDeep(signedMessage), gasData: utils.bigNumberify('0xFFFFFF'), gasLimitExecution: utils.bigNumberify('0xFFFFFF')};
  const txdata = encodeDataForExecuteSigned(copySignedMessage);
  return computeGasData(txdata);
};

export const estimateGasLimit = (gasLimitExecution: string | number | utils.BigNumberish, gasData: string | number | utils.BigNumberish) =>
  utils.bigNumberify(gasLimitExecution).add(gasData).add('40000');