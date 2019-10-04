import {utils} from 'ethers';

export const executionComparator = (execution1: any, execution2: any) =>  {
  const key1 = utils.bigNumberify(execution1.key);
  const key2 = utils.bigNumberify(execution2.key);
  if (key1.gt(key2)) {
    return 1;
  } else if (key1.lt(key2)) {
    return -1;
  } else {
    return 0;
  }
};

export const sortSignatureKeyPairsByKey = (signatureKeyPairs: any) =>
    signatureKeyPairs.sort(executionComparator);

export const sign = (payload: Uint8Array, privateKey: string): string => {
  const signingKey = new utils.SigningKey(privateKey);
  const signature = signingKey.signDigest(utils.hashMessage(payload));
  return utils.joinSignature(signature);
};

export const signHexString = (payload: string, privateKey: string): string =>
  sign(utils.arrayify(payload), privateKey);

export const signString = (stringToSign: string, privateKey: string) =>
  sign(utils.toUtf8Bytes(stringToSign), privateKey);
