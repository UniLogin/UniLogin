import {utils} from 'ethers';
import {SignedMessage} from '../../..';

export function stringifySignedMessageFields(signedMessage: SignedMessage) {
  return {
    ...signedMessage,
    value: signedMessage.value && signedMessage.value.toString(),
    gasCall: signedMessage.gasCall && signedMessage.gasCall.toString(),
    gasBase: signedMessage.gasBase && signedMessage.gasBase.toString(),
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
    gasBase: utils.bigNumberify(signedMessage.gasBase),
  };
}
