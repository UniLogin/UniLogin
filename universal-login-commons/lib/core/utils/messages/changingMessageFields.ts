import {utils} from 'ethers';
import {SignedMessage} from '../../..';

export function stringifySignedMessageFields(signedMessage: SignedMessage) {
  return {
    ...signedMessage,
    value: signedMessage.value && signedMessage.value.toString(),
    gasCall: signedMessage.gasCall && signedMessage.gasCall.toString(),
    baseGas: signedMessage.baseGas && signedMessage.baseGas.toString(),
    gasPrice: signedMessage.gasPrice && signedMessage.gasPrice.toString(),
    nonce: signedMessage.nonce.toString(),
  };
}

export function bignumberifySignedMessageFields(signedMessage: any) {
  return {
    ...signedMessage,
    value: utils.bigNumberify(signedMessage.value),
    gasCall: utils.bigNumberify(signedMessage.gasCall),
    gasPrice: utils.bigNumberify(signedMessage.gasPrice),
    baseGas: utils.bigNumberify(signedMessage.baseGas),
  };
}
