import {utils, Contract, Wallet} from 'ethers';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {sleep} from '@universal-login/commons';


const isDataForFunctionCall = (data : string, contract : any, functionName: string) => {
  const functionSignature = new utils.Interface(contract.interface).functions[functionName].sighash;
  return functionSignature === data.slice(0, functionSignature.length);
};

const isAddKeyCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKey');
const isAddKeysCall = (data : string) =>  isDataForFunctionCall(data, WalletContract, 'addKeys');

const getKeyFromData = (data : string) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};


const executionComparator = (execution1: any, execution2: any) =>  {
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

const sortExecutionsByKey = (executions: any) =>
    executions.sort(executionComparator);

const getRequiredSignatures = async (walletAddress: string, wallet: Wallet) => {
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
};

export {sleep, isAddKeyCall, getKeyFromData, isAddKeysCall, sortExecutionsByKey, getRequiredSignatures, executionComparator};
