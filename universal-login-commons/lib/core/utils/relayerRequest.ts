import {utils} from 'ethers';
import {RelayerRequest} from '../models/relayerRequest';
import {signHexString} from './signatures';

export const signRelayerRequest =
  (relayerRequest: RelayerRequest, privateKey: string) => {
    const payloadDigest = hashRelayerRequest(relayerRequest);
    relayerRequest.signature = signHexString(payloadDigest, privateKey);
    return relayerRequest;
  };

export const verifyRelayerRequest =
  (relayerRequest: RelayerRequest, address: string): boolean => {
    const computedAddress = recoverFromRelayerRequest(relayerRequest);
    return computedAddress === address;
  };

export const recoverFromRelayerRequest =
  (relayerRequest: RelayerRequest): string => {
    const payloadDigest = hashRelayerRequest(relayerRequest);
    return utils.verifyMessage(utils.arrayify(payloadDigest), relayerRequest.signature!);
  };

export const hashRelayerRequest =
  (relayerRequest: RelayerRequest): string => {
    return utils.solidityKeccak256(['bytes20'], [relayerRequest.contractAddress]);
  };
