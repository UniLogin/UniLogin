import {utils} from 'ethers';
import {Message, UnsignedMessage, SignedMessage, calculateMessageSignature} from '@universal-login/commons';
import {computeGasFields} from './estimateGas';

export const messageToSignedMessage = (message: Partial<Message>, privateKey: string): SignedMessage => {
  const unsignedMessage = messageToUnsignedMessage(message);
  const signature = calculateMessageSignature(privateKey, unsignedMessage);
  return {...unsignedMessage, signature};
};

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

  return {...messageWithoutGasEstimates, ...computeGasFields(messageWithoutGasEstimates, message.gasLimit!)};
};
