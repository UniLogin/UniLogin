import {utils} from 'ethers';
import {SignedMessage} from '../../..';

export function stringifySignedMessageFields(signedMessage: SignedMessage) {
  return {
    ...signedMessage,
    value: signedMessage.value && signedMessage.value.toString(),
    gasLimit: signedMessage.gasLimit && signedMessage.gasLimit.toString(),
    gasData: signedMessage.gasData && signedMessage.gasData.toString(),
    gasPrice: signedMessage.gasPrice && signedMessage.gasPrice.toString(),
    nonce: signedMessage.nonce.toString()
  };
}

export function bignumberifySignedMessageFields(signedMessage: any) {
  return {
    ...signedMessage,
    value:  utils.bigNumberify(signedMessage.value),
    gasLimit: utils.bigNumberify(signedMessage.gasLimit),
    gasPrice:  utils.bigNumberify(signedMessage.gasPrice),
    gasData:  utils.bigNumberify(signedMessage.gasData)
  };
}
