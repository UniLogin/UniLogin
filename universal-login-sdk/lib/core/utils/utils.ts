import {utils} from 'ethers';
import {Message, UnsignedMessage, SignedMessage, computeGasData, createFullHexString} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';

export const messageToUnsignedMessage = (message: Partial<Message>): UnsignedMessage => {
  const messageWithoutGasEstimates = {
    to: message.to!,
    from: message.from!,
    value: message.value || utils.bigNumberify(0),
    data: message.data || '0x',
    nonce: message.nonce!,
    gasPrice: message.gasPrice!,
    gasToken: message.gasToken!,
    gasData: 0,
    gasLimitExecution: 0
  };

  return fillGasEstimatesToUnsignedMessage(messageWithoutGasEstimates, message.gasLimit!);
};

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
