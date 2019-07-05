import {Wallet, utils} from 'ethers';
import {parseDomain} from '../utils/ens';

export type InitializeWithENSArgs = {
  ensName: string;
  hashLabel: string;
  node: string;
  gasPrice: string;
}
export const calculateInitializeWithENSSignature = (privateKey: string, args: InitializeWithENSArgs) => {
  const wallet = new Wallet(privateKey);
  const initializeHash = calculateInitializeWithENSHash(args);
  return wallet.signMessage(utils.arrayify(initializeHash));
}

export const calculateInitializeWithENSHash = (args: InitializeWithENSArgs) => utils.solidityKeccak256(
  ['bytes32', 'string', 'bytes32', 'uint'],
  [args.hashLabel, args.ensName, args.node, args.gasPrice]);

export const calculateSignature = (privateKey: string, ensName: string, gasPrice: string, relayerAddress: string) => {
  const [name] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  return calculateInitializeWithENSSignature(privateKey, {ensName, node, hashLabel, gasPrice});
};
