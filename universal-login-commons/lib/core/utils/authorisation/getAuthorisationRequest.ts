import {utils} from 'ethers';
import {GetAuthorisationRequest} from '../../models/authorisation';
import { sign } from '../signatures';

export const hashGetAuthorisationRequest =
  (getAuthorisationRequest: GetAuthorisationRequest): string => {
    const {walletContractAddress} = getAuthorisationRequest;
    return utils.solidityKeccak256(['bytes20'], [walletContractAddress.toLowerCase()]);
  };

export const signGetAuthorisationRequest =
  (getAuthorisationRequest: GetAuthorisationRequest, privateKey: string): void => {
    const payloadDigest = hashGetAuthorisationRequest(getAuthorisationRequest);
    getAuthorisationRequest.signature = sign(payloadDigest, privateKey);
  };

export const recoverFromGetAuthorisationRequest =
  (getAuthorisationRequest: GetAuthorisationRequest): string => {
    const payloadDigest = hashGetAuthorisationRequest(getAuthorisationRequest);
    return utils.recoverAddress(payloadDigest, getAuthorisationRequest.signature);
  };

export const verifyGetAuthorisationRequest =
  (getAuthorisationRequest: GetAuthorisationRequest, address: string): boolean => {
    const computedAddress = recoverFromGetAuthorisationRequest(getAuthorisationRequest);
    return computedAddress === address;
  };
