import {utils, providers} from 'ethers';
import {DecodedMessage, SignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {InvalidHexData} from '../errors';
import MessageItem from '../../models/messages/MessageItem';

const {executeSigned} = new utils.Interface(WalletContract.interface).functions;

export const GAS_LIMIT_MARGIN = 40000;

export const decodeDataForExecuteSigned = (data: string) => dataToMessage(
  new utils.AbiCoder((type, value) => value).decode(
    executeSigned.inputs,
    removeFunctionSigFromData(data)
  )
);

export const removeFunctionSigFromData = (hexData: string) => removeLeadingBytes(4, hexData);

const removeLeadingBytes = (n: number, data: string) => {
  if (!data.startsWith('0x')) {
    throw new InvalidHexData(data);
  } else {
    return `0x${data.slice(n * 2 + 2)}`;
  }
};

export const messageToTransaction = (message: SignedMessage) : providers.TransactionRequest =>
  Object({
    gasPrice: message.gasPrice,
    gasLimit: utils.bigNumberify(message.gasLimitExecution).add(message.gasData).add(GAS_LIMIT_MARGIN),
    to: message.from,
    value: 0,
    data: encodeDataForExecuteSigned(message)
  });

const dataToMessage = (data: any): DecodedMessage => ({
  to: data[0],
  value: data[1],
  data: data[2],
  gasPrice: data[3],
  gasToken: data[4],
  gasLimitExecution: data[5],
  gasData: data[6],
  signature: data[7]
});

export const createMessageItem = (signedMessage: SignedMessage) : MessageItem => ({
  walletAddress: signedMessage.from,
  collectedSignatureKeyPairs: [],
  transactionHash: null,
  error: null,
  message: signedMessage,
  state: 'AwaitSignature'
});
