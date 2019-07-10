import {utils} from 'ethers';

export const sign = (payload: string, privateKey: string): string => {
  const signingKey = new utils.SigningKey(privateKey);
  const signature = signingKey.signDigest(utils.hashMessage(utils.arrayify(payload)));
  return utils.joinSignature(signature);
};
