import {UnsignedMessage, createFullHexString, computeGasData, GAS_FIXED} from '@universal-login/commons';
import {Interface, BigNumberish, Arrayish, arrayify, solidityKeccak256} from 'ethers/utils';
import {Wallet, utils, Contract} from 'ethers';
import {WalletProxyInterface} from '../../lib/interfaces';
import {encodeDataForExecuteSigned} from '../../lib';

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
  [msg.to, msg.value, msg.data, msg.gasPrice, msg.gasToken, msg.gasCall, msg.gasBase];

export const encodeFunction = (ContractJSON: any, functionName: string, args: string[] = []) =>
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

export const estimateGasBaseForNoSignature = (unsignedMessage: UnsignedMessage) => {
  const encodedMessage = encodeDataForExecuteSigned({
    ...unsignedMessage,
    gasCall: createFullHexString(3),
    gasBase: createFullHexString(3),
    signature: '0x0',
  });
  const gasData = computeGasData(encodedMessage);
  return utils.bigNumberify(gasData).add(GAS_FIXED);
};
