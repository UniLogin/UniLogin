import {ContractFactory, Wallet} from 'ethers';
import {ContractJSON} from '../types/ContractJSON';

export async function deployContract(wallet: Wallet, contractJSON: ContractJSON, args = []) {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy(...args);
}
