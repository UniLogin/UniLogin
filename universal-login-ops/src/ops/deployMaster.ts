import {Wallet, utils} from 'ethers';
import {deployContractAndWait, TransactionOverrides} from '@unilogin/commons';
import {beta2, gnosisSafe} from '@unilogin/contracts';
import {CommandOverrides} from '../cli/connectAndExecute';
import {getTransactionOverrides} from '../utils/getTransactionOverrides';

export default async function deployMasterContract(wallet: Wallet, overrides: CommandOverrides) {
  console.log('Deploying wallet master contract...');
  const transactionOverrides: TransactionOverrides = {...getTransactionOverrides(overrides), gasLimit: utils.bigNumberify(5000000)};
  const contractAddress = await deployContractAndWait(wallet, beta2.WalletContract as any, [], transactionOverrides);
  console.log(`Wallet master contract address: ${contractAddress}`);
}

export async function deployGnosisSafe(wallet: Wallet, overrides: CommandOverrides) {
  console.log('Deploying Gnosis Safe contract...');
  const transactionOverrides: TransactionOverrides = {...getTransactionOverrides(overrides), gasLimit: utils.bigNumberify(7000000)};
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.GnosisSafe as any, [], transactionOverrides);
  console.log(`Gnosis Safe contract address: ${contractAddress}`);
}
