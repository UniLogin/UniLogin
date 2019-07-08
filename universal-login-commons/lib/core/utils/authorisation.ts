import {utils} from 'ethers';

import {CancelAuthorisationRequest} from '../models/authorisation';

export const hashCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const {walletContractAddress, key} = cancelAuthorisationRequest;
    return utils.solidityKeccak256(['bytes20', 'bytes20'], [walletContractAddress.toLowerCase(), key.toLowerCase()]);
  };

export const sign = (payload: string, privateKey: string): utils.Signature => {
  const signingKey = new utils.SigningKey(privateKey);
  return signingKey.signDigest(payload);
}

export const signCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, privateKey: string): utils.Signature => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    return sign(payloadDigest, privateKey);
  };

export const recoverFromCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, signature: utils.Signature): string => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const computedAddress = utils.recoverAddress(payloadDigest, signature);
    return computedAddress;
  };

export const verifyCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, signature: utils.Signature, address: string): boolean => {
    const computedAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest, signature);
    return computedAddress === address;
  };
