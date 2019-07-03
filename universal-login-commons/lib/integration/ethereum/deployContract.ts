import {ContractFactory, Wallet} from 'ethers';
import {ContractJSON} from '../../core/types/ContractJSON';
import {TransactionOverrides} from '../../core/types/transactions';
import {defaultDeployOptions} from '../../utils/transaction';

export async function deployContract(wallet: Wallet, contractJSON: ContractJSON, args = [], overrides?: TransactionOverrides) {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy(...args, overrides);
}

export async function deployContractAndWait(wallet: Wallet, contractJSON: ContractJSON, args = [], overrides?: TransactionOverrides) {
  const deployTransaction = {
    ...defaultDeployOptions,
    ...overrides,
    ...new ContractFactory(contractJSON.abi, contractJSON.bytecode).getDeployTransaction(...args),
  };
  const {hash} = await wallet.sendTransaction(deployTransaction);
  console.log(`Transaction hash: ${hash}`);
  const {contractAddress} = await wallet.provider.waitForTransaction(hash!);
  return contractAddress!;
}
