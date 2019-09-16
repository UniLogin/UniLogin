import {utils} from 'ethers';
import {UnsignedMessage, SignedMessage, computeGasData, createFullHexString} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';

export const fillGasEstimatesToUnsignedMessage = (unsignedMessage: UnsignedMessage, gasLimit: utils.BigNumberish): UnsignedMessage => {
  const gasData = estimateGasDataFromUnsignedMessage(unsignedMessage);
  const gasLimitExecution = utils.bigNumberify(gasLimit).sub(gasData);
  return {...unsignedMessage, gasData, gasLimitExecution};
};

export const estimateGasDataFromUnsignedMessage = (unsignedMessage: UnsignedMessage) => {
  const signature = createFullHexString(65);
  return estimateGasDataFromSignedMessage({...unsignedMessage, signature});
};

export const estimateGasDataFromSignedMessage = (signedMessage: SignedMessage) => {
  const txdata = encodeDataForExecuteSigned(signedMessage);
  return computeGasData(txdata);
};
