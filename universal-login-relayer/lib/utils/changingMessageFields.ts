import {utils} from 'ethers';
import {SignedMessage} from '@universal-login/commons';

export function stringifySignedMessageFields(signedMessage: SignedMessage) {
  return {
    ...signedMessage,
    value: signedMessage.value && signedMessage.value.toString(),
    gasLimit: signedMessage.gasLimit && signedMessage.gasLimit.toString(),
    gasPrice: signedMessage.gasPrice && signedMessage.gasPrice.toString()
  };
}

export function bignumberifySignedMessageFields(signedMessage: any) {
  return {
    ...signedMessage,
    value:  utils.bigNumberify(signedMessage.value),
    gasLimit: utils.bigNumberify(signedMessage.gasLimit),
    gasPrice:  utils.bigNumberify(signedMessage.gasPrice)
  };
}
