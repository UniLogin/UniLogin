import {utils} from 'ethers';
import {AuthorisationRequest} from '../models/authorisation';
import {sign} from './signatures';

export const signAuthorisationRequest =
  (authorisationRequest: AuthorisationRequest, privateKey: string) => {
    const payloadDigest = hashAuthorisationRequest(authorisationRequest);
    authorisationRequest.signature = sign(payloadDigest, privateKey);
    return authorisationRequest;
  };

export const verifyAuthorisationRequest =
  (AuthorisationRequest: AuthorisationRequest, address: string): boolean => {
    const computedAddress = recoverFromAuthorisationRequest(AuthorisationRequest);
    return computedAddress === address;
  };

export const recoverFromAuthorisationRequest =
  (AuthorisationRequest: AuthorisationRequest): string => {
    const payloadDigest = hashAuthorisationRequest(AuthorisationRequest);
    return utils.verifyMessage(utils.arrayify(payloadDigest), AuthorisationRequest.signature!);
  };

export const hashAuthorisationRequest =
  (AuthorisationRequest: AuthorisationRequest): string => {
    return utils.solidityKeccak256(['bytes20'], [AuthorisationRequest.contractAddress]);
  };
