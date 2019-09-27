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

export const signHexString = (payload: string, privateKey: string): string => {
  const signingKey = new utils.SigningKey(privateKey);
  const signature = signingKey.signDigest(utils.hashMessage(utils.arrayify(payload)));
  return utils.joinSignature(signature);
};

export const signString = (stringToSign: string, privateKey: string) => {
  const signingKey = new utils.SigningKey(privateKey);
  const hash = utils.hexlify(utils.toUtf8Bytes(stringToSign));
  const signature = signingKey.signDigest(utils.hashMessage(utils.arrayify(hash)));
  return utils.joinSignature(signature);
};
