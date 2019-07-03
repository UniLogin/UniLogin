import {utils, ContractFactory} from 'ethers';
import {ContractJSON} from '../..';

export const defaultDeployOptions = {
  gasLimit: utils.bigNumberify(3500000),
  gasPrice: utils.bigNumberify(9000000000),
};

export const getDeployTransaction = (contractJSON : ContractJSON, args : string[] = []) => {
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const transaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(abi, bytecode).getDeployTransaction(...args),
  };
  return transaction;
};
