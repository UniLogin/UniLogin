import {Wallet, utils} from 'ethers';
import {parseDomain} from '../utils/ens';
import {InitializeWithENSArgs} from '../models/InitializeWithENSArgs';

export const calculateSignature = (dataHash: string, privateKey: string) => {
  const wallet = new Wallet(privateKey);
  return wallet.signMessage(utils.arrayify(dataHash));
};

export const calculateInitializeWithENSSignature = (args: InitializeWithENSArgs, privateKey: string) => {
  const initializeHash = calculateInitializeWithENSHash(args);
  return calculateSignature(initializeHash, privateKey);
};

export const calculateInitializeWithENSHash = (args: InitializeWithENSArgs) => utils.solidityKeccak256(
  ['bytes32', 'string', 'bytes32', 'uint'],
  [args.hashLabel, args.ensName, args.node, args.gasPrice]);

export const calculateDeploySignature = (ensName: string, gasPrice: string, privateKey: string) => {
  const [name] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  return calculateInitializeWithENSSignature({ensName, node, hashLabel, gasPrice}, privateKey);
};

export const calculateInitializeSignature = (initializeData: string, privateKey: string) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  return calculateSignature(dataHash, privateKey);
};
