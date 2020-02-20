import {utils} from 'ethers';
import {ensure, isDataForFunctionCall} from '@unilogin/commons';
import {beta2} from '@unilogin/contracts';
import {InvalidHexData} from './errors';

export const isAddKeyCall = (data: string) => isDataForFunctionCall(data, beta2.interfaces.WalletContractInterface, 'addKey');
export const isAddKeysCall = (data: string) => isDataForFunctionCall(data, beta2.interfaces.WalletContractInterface, 'addKeys');
export const isRemoveKeyCall = (data: string) => isDataForFunctionCall(data, beta2.interfaces.WalletContractInterface, 'removeKey');

export const getFunctionParametersData = (data: string) => {
  ensure(data.startsWith('0x'), InvalidHexData, data);
  return `0x${data.slice(10)}`;
};

export const decodeParametersFromData = (data: string, functionAbi: string[]) => {
  const codec = new utils.AbiCoder();
  const parametersData = getFunctionParametersData(data);
  return codec.decode(functionAbi, parametersData);
};

export const getKeyFromHashAndSignature = (messageHash: string, signature: string) =>
  utils.verifyMessage(utils.arrayify(messageHash), signature);

export const getRemovedKey = (parameters: string[]) => parameters[1];
