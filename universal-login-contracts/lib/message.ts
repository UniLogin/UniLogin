import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {Message, UnsignedMessage, SignedMessage, calculateMessageSignature, EMPTY_DATA, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, NetworkVersion, WalletVersion, OperationType} from '@universal-login/commons';
import {calculateSafeTxGas, calculateBaseGas} from './estimateGas';

export const messageToSignedMessage = (message: Partial<Message>, privateKey: string, networkVersion: NetworkVersion, walletVersion: WalletVersion): SignedMessage => {
  const unsignedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
  const signature = calculateMessageSignature(privateKey, unsignedMessage);
  return {...unsignedMessage, signature};
};

export const messageToUnsignedMessage = (message: Partial<Message>, networkVersion: NetworkVersion, walletVersion: WalletVersion): UnsignedMessage => {
  const messageWithoutGasEstimates = {
    to: message.to!,
    from: message.from!,
    value: message.value || utils.bigNumberify(0),
    data: message.data || '0x',
    nonce: message.nonce!,
    gasPrice: message.gasPrice!,
    gasToken: message.gasToken!,
    operationType: message.operationType!,
    refundReceiver: message.refundReceiver!,
  };
  const baseGas = calculateBaseGas(messageWithoutGasEstimates, networkVersion, walletVersion);
  const safeTxGas = calculateSafeTxGas(message.gasLimit!, baseGas);
  return {...messageWithoutGasEstimates, baseGas, safeTxGas};
};

export const emptyMessage = {
  to: '',
  value: utils.parseEther('0.0'),
  data: EMPTY_DATA,
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE),
  gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
  gasToken: AddressZero,
};

export const unsignedMessageToSignedMessage = (unsignedMessage: UnsignedMessage, privateKey: string) => {
  const signature = calculateMessageSignature(privateKey, unsignedMessage);
  return {...unsignedMessage, signature};
};
