import {utils} from 'ethers';
import {Message, UnsignedMessage, SignedMessage, calculateMessageSignature, EMPTY_DATA, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
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

export const emptyMessage = {
  to: '',
  value: utils.parseEther('0.0'),
  data: EMPTY_DATA,
  nonce: 0,
  gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE),
  gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
  gasToken: '0x0000000000000000000000000000000000000000'
};

export const unsignedMessageToSignedMessage = (unsignedMessage: UnsignedMessage, privateKey: string) => {
  const signature = calculateMessageSignature(privateKey, unsignedMessage);
  return {...unsignedMessage, signature};
};
