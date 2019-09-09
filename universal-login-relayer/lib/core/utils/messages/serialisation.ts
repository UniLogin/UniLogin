import {utils} from 'ethers';
import {DecodedMessage} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {InvalidHexData} from '../errors';

const {executeSigned} = new utils.Interface(WalletContract.interface).functions;

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

const dataToMessage = (data: any): DecodedMessage => ({
  to: data[0],
  value: data[1],
  data: data[2],
  gasPrice: data[3],
  gasToken: data[4],
  gasLimit: data[5],
  signature: data[6]
});
