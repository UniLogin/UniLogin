import {utils} from 'ethers';

export const isDataForFunctionCall = (data: string, contract: any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};
