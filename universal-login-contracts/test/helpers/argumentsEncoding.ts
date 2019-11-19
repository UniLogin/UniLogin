import {UnsignedMessage} from '@universal-login/commons';
import {Interface, BigNumberish, Arrayish, arrayify, solidityKeccak256} from 'ethers/utils';
import {Wallet, utils, Contract} from 'ethers';
import WalletProxy from '../../build/WalletProxy.json';
import {estimateGasBaseFromSignedMessage} from '../../lib/estimateGas';

export const switchENSNameInInitializeArgs = (initializeArgs: string[], label: string, domain = 'mylogin.eth') => {
  const ensName = `${label}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(ensName);
  initializeArgs[1] = hashLabel;
  initializeArgs[2] = ensName;
  initializeArgs[3] = node;
  return initializeArgs;
};

export const messageSignature = (
  wallet: Wallet, to: string, from: string, value: BigNumberish, data: Arrayish, nonce: string | number, gasToken: string, gasPrice: BigNumberish, gasCall: BigNumberish, gasBase: BigNumberish) =>
  wallet.signMessage(
    getMessageArrayify({to, from, value, data, nonce, gasToken, gasPrice, gasCall, gasBase}),
  );

const getMessageArrayify = (message: Partial<UnsignedMessage>) =>
  arrayify(solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint', 'uint'],
    [message.to, message.from, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasCall, message.gasBase],
  ));

export const messageSignatureForApprovals = (wallet: Wallet, id: BigNumberish) =>
  wallet.signMessage(arrayify(solidityKeccak256(['uint256'], [id])));

export const getExecutionArgs = (msg: UnsignedMessage) =>
  [msg.to, msg.value, msg.data, msg.gasPrice, msg.gasToken, msg.gasCall, msg.gasBase];

export const encodeFunction = (ContractJSON: any, functionName: string, args: string[] = []) =>
  new Interface(ContractJSON.interface).functions[`${functionName}`].encode(args);

export const setupUpdateMessage = async (proxyAsWalletContract: Contract, newWalletAddress: string) => {
  const updateData = new utils.Interface(WalletProxy.interface).functions.upgradeTo.encode([newWalletAddress]);
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

export const estimateGasBaseForNoSignature = (unsignedMessage: UnsignedMessage) => estimateGasBaseFromSignedMessage({...unsignedMessage, signature: '0x0'});
