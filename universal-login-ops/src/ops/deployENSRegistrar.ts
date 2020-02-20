import {Wallet, Contract, utils} from 'ethers';
import {deployContractAndWait, TransactionOverrides} from '@unilogin/commons';
import {gnosisSafe} from '@unilogin/contracts';
import {CommandOverrides} from '../cli/connectAndExecute';
import {getTransactionOverrides} from '../utils/getTransactionOverrides';

export default async function deployENSRegistrar(wallet: Wallet, overrides?: CommandOverrides) {
  console.log('Deploying ENSRegistrar contract...');
  const transactionOverrides: TransactionOverrides = {...getTransactionOverrides(overrides), gasLimit: utils.bigNumberify(5000000)};
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ENSRegistrar as any, [], transactionOverrides);
  console.log(`ENSRegistrar address: ${contractAddress}`);
  return new Contract(contractAddress, gnosisSafe.ENSRegistrar.interface as any, wallet.provider);
}
