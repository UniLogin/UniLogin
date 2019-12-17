import {utils} from 'ethers';
import {SignedMessage} from '../../..';

export function stringifySignedMessageFields(signedMessage: SignedMessage) {
  return {
    ...signedMessage,
    value: signedMessage.value && signedMessage.value.toString(),
    safeTxGas: signedMessage.safeTxGas && signedMessage.safeTxGas.toString(),
    baseGas: signedMessage.baseGas && signedMessage.baseGas.toString(),
    gasPrice: signedMessage.gasPrice && signedMessage.gasPrice.toString(),
    nonce: signedMessage.nonce.toString(),
  };
}

export function bignumberifySignedMessageFields(signedMessage: any) {
  return {
    ...signedMessage,
    value: utils.bigNumberify(signedMessage.value),
    safeTxGas: utils.bigNumberify(signedMessage.safeTxGas),
    gasPrice: utils.bigNumberify(signedMessage.gasPrice),
    baseGas: utils.bigNumberify(signedMessage.baseGas),
  };
}
