import {utils} from 'ethers';
import {InitializeWithENSArgs} from '../models/InitializeWithENSArgs';
import {sign} from './signatures';

export const calculateInitializeWithENSSignature = (args: InitializeWithENSArgs, privateKey: string) => {
  const initializeHash = utils.solidityKeccak256(
    ['bytes32', 'string', 'bytes32', 'uint'],
    [args.hashLabel, args.ensName, args.node, args.gasPrice]);
  return sign(initializeHash, privateKey);
};

export const calculateInitializeSignature = (initializeData: string, privateKey: string) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  return sign(dataHash, privateKey);
};
