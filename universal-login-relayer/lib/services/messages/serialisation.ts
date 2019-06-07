import {utils} from 'ethers';
import {MessageWithoutFrom} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {InvalidHexData} from '../../utils/errors';

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
