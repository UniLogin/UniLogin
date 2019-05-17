import {utils} from 'ethers';
import {Message, Omit} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import { InvalidHexData } from '../../utils/errors';

const {executeSigned} = new utils.Interface(WalletContract.interface).functions;

type MessageWithoutFrom = Omit<Message, 'from'>;

export const encodeDataForExecuteSigned = (message: MessageWithoutFrom) =>
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

export const decodeDataForExecuteSigned = (data: string) => dataToMessage(
  new utils.AbiCoder((type, value) => value).decode(
    executeSigned.inputs,
    removeFunctionSigFromData(4, data)
  )
);

export const removeFunctionSigFromData = (n: number, hexData: string) => {
  if (!hexData.startsWith('0x')) {
    throw new InvalidHexData(hexData);
  }
  return removeLeadingBytes(n, hexData);
};

const removeLeadingBytes = (n: number, data: string) => `0x${data.slice(n * 2 + 2)}`;

const dataToMessage = (data: any[]): MessageWithoutFrom => ({
  to: data[0],
  value: data[1],
  data: data[2],
  nonce: parseInt(data[3], 16),
  gasPrice: data[4],
  gasToken: data[5],
  gasLimit: data[6],
  operationType: parseInt(data[7], 16),
  signature: data[8]
});
