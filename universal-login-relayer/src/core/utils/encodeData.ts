import {utils} from 'ethers';
import {beta2} from '@universal-login/contracts';
import {ensure} from '@universal-login/commons';
import {InvalidHexData} from './errors';

export const isDataForFunctionCall = (data: string, contract: any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};

export const isAddKeyCall = (data: string) => isDataForFunctionCall(data, beta2.WalletContract, 'addKey');
export const isAddKeysCall = (data: string) => isDataForFunctionCall(data, beta2.WalletContract, 'addKeys');
export const isRemoveKeyCall = (data: string) => isDataForFunctionCall(data, beta2.WalletContract, 'removeKey');

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
