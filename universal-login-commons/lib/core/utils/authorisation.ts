import {utils} from 'ethers';
import {CancelAuthorisationRequest} from '../models/authorisation';
import { sign } from './sign';

export const hashCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const {walletContractAddress, publicKey} = cancelAuthorisationRequest;
    return utils.solidityKeccak256(['bytes20', 'bytes20'], [walletContractAddress.toLowerCase(), publicKey.toLowerCase()]);
  };

export const signCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, privateKey: string): void => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    cancelAuthorisationRequest.signature = sign(payloadDigest, privateKey);
  };

export const recoverFromCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest): string => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    return utils.verifyMessage(utils.arrayify(payloadDigest), cancelAuthorisationRequest.signature);
  };

export const verifyCancelAuthorisationRequest =
  (cancelAuthorisationRequest: CancelAuthorisationRequest, address: string): boolean => {
    const computedAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    return computedAddress === address;
  };
