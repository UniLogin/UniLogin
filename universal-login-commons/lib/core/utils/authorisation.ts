import {utils} from 'ethers';

import {CancelAuthorisationRequest} from '../models/authorisation';

export const hashCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const payloadString = JSON.stringify(cancelAuthorisationRequest);
    const payloadBytes = utils.toUtf8Bytes(payloadString);
    return utils.keccak256(payloadBytes);
  };

export const signCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, privateKey: string): utils.Signature => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const signingKey = new utils.SigningKey(privateKey);
    return signingKey.signDigest(payloadDigest);
  };

export const verifyCancelAuthroisationRequest =
  (payloadDigest: string, signature: utils.Signature, address: string): [boolean, string] => {
    const computedAddress = utils.recoverAddress(payloadDigest, signature);
    return [computedAddress === address, computedAddress];
  };
