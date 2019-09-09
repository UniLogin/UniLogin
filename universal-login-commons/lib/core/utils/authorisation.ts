import {utils} from 'ethers';
import {RelayerRequest} from '../models/relayerRequest';
import {sign} from './signatures';

export const signAuthorisationRequest =
  (relayerRequest: RelayerRequest, privateKey: string) => {
    const payloadDigest = hashAuthorisationRequest(relayerRequest);
    relayerRequest.signature = sign(payloadDigest, privateKey);
    return relayerRequest;
  };

export const verifyAuthorisationRequest =
  (relayerRequest: RelayerRequest, address: string): boolean => {
    const computedAddress = recoverFromAuthorisationRequest(relayerRequest);
    return computedAddress === address;
  };

export const recoverFromAuthorisationRequest =
  (relayerRequest: RelayerRequest): string => {
    const payloadDigest = hashAuthorisationRequest(relayerRequest);
    return utils.verifyMessage(utils.arrayify(payloadDigest), relayerRequest.signature!);
  };

export const hashAuthorisationRequest =
  (relayerRequest: RelayerRequest): string => {
    return utils.solidityKeccak256(['bytes20'], [relayerRequest.contractAddress]);
  };
