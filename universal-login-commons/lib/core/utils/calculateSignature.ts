import {Wallet, utils} from 'ethers';
import {parseDomain} from '../utils/ens';
import {InitializeWithENSArgs} from '../models/InitializeWithENSArgs';

export const calculateInitializeWithENSSignature = (args: InitializeWithENSArgs, privateKey: string) => {
  const wallet = new Wallet(privateKey);
  const initializeHash = calculateInitializeWithENSHash(args);
  return wallet.signMessage(utils.arrayify(initializeHash));
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
