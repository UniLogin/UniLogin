import {utils, providers} from 'ethers';
import {DecodedMessage, SignedMessage, DecodedMessageGnosis} from '@unilogin/commons';
import {encodeDataForExecuteSigned, WalletContractInterface, GnosisSafeInterface} from '@unilogin/contracts';
import {InvalidHexData} from '../errors';
import MessageItem from '../../models/messages/MessageItem';

const {executeSigned} = WalletContractInterface.functions;
const {execTransaction} = GnosisSafeInterface.functions;

export const GAS_LIMIT_MARGIN = 35000;

export const decodeDataForExecuteSigned = (data: string) => dataToMessage(
  new utils.AbiCoder((type, value) => value).decode(
    executeSigned.inputs,
    removeFunctionSigFromData(data),
  ),
);

export const decodeDataForExecTransaction = (data: string) => dataToMessageGnosis(
  new utils.AbiCoder((type, value) => value).decode(
    execTransaction.inputs,
    removeFunctionSigFromData(data),
  ),
);

export const removeFunctionSigFromData = (hexData: string) => removeLeadingBytes(4, hexData);

const removeLeadingBytes = (n: number, data: string) => {
  if (!data.startsWith('0x')) {
    throw new InvalidHexData(data);
  } else {
    return `0x${data.slice(n * 2 + 2)}`;
  }
};

export const messageToTransaction = (message: SignedMessage): providers.TransactionRequest =>
  Object({
    gasPrice: message.gasPrice,
    gasLimit: utils.bigNumberify(message.safeTxGas).add(message.baseGas).add(GAS_LIMIT_MARGIN),
    to: message.from,
    value: 0,
    data: encodeDataForExecuteSigned(message),
  });

const dataToMessage = (data: any): DecodedMessage => ({
  to: data[0],
  value: data[1],
  data: data[2],
  gasPrice: data[3],
  gasToken: data[4],
  safeTxGas: data[5],
  baseGas: data[6],
  signature: data[7],
});

const dataToMessageGnosis = (data: any): DecodedMessageGnosis => ({
  to: data[0],
  value: data[1],
  data: data[2],
  operationType: data[3],
  safeTxGas: data[4],
  baseGas: data[5],
  gasPrice: data[6],
  gasToken: data[7],
  refundReceiver: data[8],
  signature: data[9],
});

export const createMessageItem = (signedMessage: SignedMessage, tokenPriceInEth: string, refundPayerId: string | null = null): MessageItem => ({
  walletAddress: signedMessage.from,
  collectedSignatureKeyPairs: [],
  transactionHash: null,
  error: null,
  message: signedMessage,
  state: 'AwaitSignature',
  refundPayerId,
  gasPriceUsed: null,
  gasUsed: null,
  tokenPriceInEth,
});
