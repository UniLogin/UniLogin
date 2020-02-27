import {Interface} from 'ethers/utils';
import {utils, Contract} from 'ethers';
import {UnsignedMessage} from '@unilogin/commons';
import {WalletProxyInterface} from './interfaces';

export const switchENSNameInInitializeArgs = (initializeArgs: string[], label: string, domain = 'mylogin.eth') => {
  const ensName = `${label}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(ensName);
  initializeArgs[1] = hashLabel;
  initializeArgs[2] = ensName;
  initializeArgs[3] = node;
  return initializeArgs;
};

export const getExecutionArgs = (msg: UnsignedMessage) =>
  [msg.to, msg.value, msg.data, msg.gasPrice, msg.gasToken, msg.safeTxGas, msg.baseGas];

export const encodeFunction = (ContractJSON: any, functionName: string, args: string[] | string[][] = []) =>
  new Interface(ContractJSON.interface).functions[`${functionName}`].encode(args);

export const setupUpdateMessage = async (proxyAsWalletContract: Contract, newWalletAddress: string) => {
  const updateData = WalletProxyInterface.functions.upgradeTo.encode([newWalletAddress]);
  return {
    to: proxyAsWalletContract.address,
    from: proxyAsWalletContract.address,
    data: updateData,
    value: 0,
    nonce: await proxyAsWalletContract.lastNonce(),
    gasLimit: '200000',
    gasPrice: '1',
    gasToken: '0x0000000000000000000000000000000000000000',
  };
};
