import {utils} from 'ethers';
import {Message, UnsignedMessage, SignedMessage, calculateMessageSignature, NetworkVersion, WalletVersion} from '@unilogin/commons';
import {calculateSafeTxGas, calculateBaseGas} from './estimateGas';
import {calculateMessageSignature as calculateGnosisSignature} from './gnosis-safe@1.1.1/utils';

export const messageToSignedMessage = (message: Partial<Message>, privateKey: string, networkVersion: NetworkVersion, walletVersion: WalletVersion): SignedMessage => {
  const unsignedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
  const signature = calculateSignature(unsignedMessage, privateKey, walletVersion);
  return {...unsignedMessage, signature};
};

export const calculateSignature = (unsignedMessage: UnsignedMessage, privateKey: string, walletVersion: WalletVersion) => {
  switch (walletVersion) {
    case 'beta1':
    case 'beta2':
      return calculateMessageSignature(privateKey, unsignedMessage);
    case 'beta3':
      return calculateGnosisSignature(unsignedMessage, privateKey);
    default:
      throw TypeError(`Invalid wallet version: ${walletVersion}`);
  };
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

export const unsignedMessageToSignedMessage = (unsignedMessage: UnsignedMessage, privateKey: string) => {
  const signature = calculateMessageSignature(privateKey, unsignedMessage);
  return {...unsignedMessage, signature};
};
