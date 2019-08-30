import {Message} from '@universal-login/commons';
import {Interface, namehash, BigNumberish, Arrayish, arrayify, solidityKeccak256} from 'ethers/utils';
import {Wallet, utils} from 'ethers';

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
  wallet: Wallet, to: string, from: string, value: BigNumberish, data: Arrayish, nonce: string | number, gasToken: string, gasPrice: BigNumberish, gasLimit: BigNumberish) =>
  wallet.signMessage(
    getMessageArrayify({to, from, value, data, nonce, gasToken, gasPrice, gasLimit})
   );

const getMessageArrayify = (message : Message) =>
  arrayify(solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
    [message.to, message.from, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit]
  ));

export const messageSignatureForApprovals = (wallet: Wallet, id: BigNumberish) =>
  wallet.signMessage(arrayify(solidityKeccak256(['uint256'], [id])));

export const getExecutionArgs = (msg: Message) =>
  [msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit];

export const encodeFunction = (ContractJSON: any, functionName: string, args: string[] = []) =>
  new Interface(ContractJSON.interface).functions[`${functionName}`].encode(args);
