import {Wallet, utils} from 'ethers';

export type InitializeWithENSArgs = {
  name: string;
  hashLabel: string;
  node: string;
  relayerAddress: string;
  gasPrice: string;
}
export const calculateInitializeWithENSSignature = (privateKey: string, args: InitializeWithENSArgs) => {
  const wallet = new Wallet(privateKey);
  const initializeHash = calculateInitializeWithENSHash(args);
  return wallet.signMessage(utils.arrayify(initializeHash));
}

export const calculateInitializeWithENSHash = (args: InitializeWithENSArgs) => utils.solidityKeccak256(
  ['bytes32', 'string', 'bytes32', 'address', 'uint'],
  [args.hashLabel, args.name, args.node, args.relayerAddress, args.gasPrice]);
