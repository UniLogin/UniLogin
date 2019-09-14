import {utils, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {SignedMessage} from '@universal-login/commons';
import MessageItem from '../models/messages/MessageItem';


export const isDataForFunctionCall = (data : string, contract : any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};

export const isAddKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKey');
export const isAddKeysCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKeys');
export const isRemoveKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'removeKey');

export const getKeyFromData = (data : string, functionName: string) => {
  const codec = new utils.AbiCoder();
  const sigHash = new utils.Interface(WalletContract.interface).functions[functionName].sighash;
  const [address] = (codec.decode(['bytes32'], data.replace(sigHash.slice(2), '')));
  return utils.getAddress(utils.hexlify(utils.stripZeros(address)));
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
