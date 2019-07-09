import {utils} from 'ethers';
import {CancelAuthorisationRequest} from '../models/authorisation';

export const hashCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const {walletContractAddress, publicKey} = cancelAuthorisationRequest;
    return utils.solidityKeccak256(['bytes20', 'bytes20'], [walletContractAddress.toLowerCase(), publicKey.toLowerCase()]);
  };

export const sign = (payload: string, privateKey: string): string => {
  const signingKey = new utils.SigningKey(privateKey);
  const signature = signingKey.signDigest(payload);
  return utils.joinSignature(signature);
};

export const signCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, privateKey: string): void => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    cancelAuthorisationRequest.signature = sign(payloadDigest, privateKey);
  };

export const recoverFromCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    return utils.recoverAddress(payloadDigest, cancelAuthorisationRequest.signature);
  };

export const verifyCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, address: string): boolean => {
    const computedAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    return computedAddress === address;
  };
