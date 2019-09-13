import {SignedMessage, computeGasData} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '../../lib/encode';

export const estimateGasDataFromSignedMessage = (signedMessage: SignedMessage) => {
  const txdata = encodeDataForExecuteSigned(signedMessage);
  return computeGasData(txdata);
};
