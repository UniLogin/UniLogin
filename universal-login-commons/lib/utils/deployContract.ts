import {ContractFactory, Wallet} from 'ethers';
import {ContractJSON} from '../types/ContractJSON';
import {TransactionOverrides} from '../types/transactions';

export async function deployContract(wallet: Wallet, contractJSON: ContractJSON, args = [], overrides?: TransactionOverrides) {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy(...args, overrides);
}
