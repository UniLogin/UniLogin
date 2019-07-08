import {utils} from 'ethers';
import {Message, ContractJSON, KeyPair, calculateInitializeWithENSSignature} from '@universal-login/commons';
import WalletMaster from '../build/WalletMaster.json';
import WalletMasterWithRefund from '../build/WalletMasterWithRefund.json';

export type EnsDomainData = {
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
};

export const encodeInitializeWithENSData = (args: string[]) => new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode(args);

export const encodeInitializeWithRefundData = (args: string[]) => new utils.Interface(WalletMasterWithRefund.interface).functions.initializeWithRefund.encode(args);

export const encodeInitializeData = (publicKey: string) => new utils.Interface(WalletMaster.interface).functions.initialize.encode([publicKey]);


const {executeSigned} = new utils.Interface(WalletMaster.interface).functions;

export const encodeDataForExecuteSigned = (message: Message) =>
  executeSigned.encode([
    message.to,
    message.value,
    message.data,
    message.nonce,
    message.gasPrice,
    message.gasToken,
    message.gasLimit,
    message.operationType,
    message.signature
  ]);

export const getDeployData = (contractJSON: ContractJSON, args: any[]) =>
  new utils.Interface(contractJSON.interface).deployFunction.encode(`0x${contractJSON.bytecode}`, args);

type SetupInitializeWithENSArgs = {
  keyPair: KeyPair;
  ensDomainData: EnsDomainData;
  name?: string;
  domain?: string;
};

interface SetupInitializeWithENSAndRefundArgs extends SetupInitializeWithENSArgs {
  relayerAddress: string;
  gasPrice: string;
}

export function setupInitializeWithENSArgs({keyPair, ensDomainData, name = 'name', domain = 'mylogin.eth'}: SetupInitializeWithENSArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [keyPair.publicKey, hashLabel, ensName, node, ensDomainData.ensAddress, ensDomainData.registrarAddress, ensDomainData.resolverAddress];
  return args;
}

export async function setupInitializeWithENSAndRefundArgs({keyPair, ensDomainData, name = 'name', domain = 'mylogin.eth', relayerAddress, gasPrice}: SetupInitializeWithENSAndRefundArgs) {
  const args = setupInitializeWithENSArgs({keyPair, ensDomainData, name, domain});
  const argsToSign = {hashLabel: args[1], ensName: args[2], node: args[3], gasPrice};
  const signature = await calculateInitializeWithENSSignature(argsToSign, keyPair.privateKey);
  return [...args, relayerAddress, gasPrice, signature];
}
