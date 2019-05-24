import {utils, Contract, Wallet, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {SignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '../services/transactions/serialisation';


export const isDataForFunctionCall = (data : string, contract : any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};

export const isAddKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKey');
export const isAddKeysCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKeys');

export const getKeyFromData = (data : string) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};


export const executionComparator = (execution1: any, execution2: any) =>  {
  const key1 = utils.bigNumberify(execution1.key);
  const key2 = utils.bigNumberify(execution2.key);
  if (key1.gt(key2)) {
    return 1;
  } else if (key1.lt(key2)) {
    return -1;
  } else {
    return 0;
  }
};

export const sortExecutionsByKey = (executions: any) =>
    executions.sort(executionComparator);

export const getRequiredSignatures = async (walletAddress: string, wallet: Wallet) => {
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
};

export const messageToTransaction = (message: SignedMessage) : providers.TransactionRequest =>
  Object({
    gasPrice: message.gasPrice,
    gasLimit: message.gasLimit,
    to: message.from,
    value: 0,
    data: encodeDataForExecuteSigned(message)
  });

export const getKeyFromHashAndSignature = (messageHash: string, signature: string) =>
  utils.verifyMessage(utils.arrayify(messageHash), signature);
