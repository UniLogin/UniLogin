import {utils, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {SignedMessage, ensure} from '@universal-login/commons';
import MessageItem from '../models/messages/MessageItem';


export const isDataForFunctionCall = (data : string, contract : any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};

export const isAddKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKey');
export const isAddKeysCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKeys');
export const isRemoveKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'removeKey');

export const getFunctionParametersData = (data: string) => {
  ensure(data.startsWith('0x'), Error, `Data missing 0x: ${data}`);
  return `0x${data.slice(10)}`;
};

export const decodeParametersFromData = (data: string, functionAbi: string[]) => {
  const codec = new utils.AbiCoder();
  const parametersData = getFunctionParametersData(data);
  return codec.decode(functionAbi, parametersData);
};

export const messageToTransaction = (message: SignedMessage) : providers.TransactionRequest =>
  Object({
    gasPrice: message.gasPrice,
    gasLimit: utils.bigNumberify(message.gasLimitExecution).add(message.gasData),
    to: message.from,
    value: 0,
    data: encodeDataForExecuteSigned(message)
  });

export const getKeyFromHashAndSignature = (messageHash: string, signature: string) =>
  utils.verifyMessage(utils.arrayify(messageHash), signature);

export const createMessageItem = (signedMessage: SignedMessage) : MessageItem => ({
  walletAddress: signedMessage.from,
  collectedSignatureKeyPairs: [],
  transactionHash: null,
  error: null,
  message: signedMessage,
  state: 'AwaitSignature'
});
