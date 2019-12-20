import {Wallet, utils} from 'ethers';
import {deployContractAndWait, TransactionOverrides} from '@universal-login/commons';
import {beta2} from '@universal-login/contracts';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployMasterContract(wallet: Wallet, overrides: CommandOverrides) {
  console.log('Deploying wallet master contract...');
  const transactionOverrides: TransactionOverrides = {
    gasLimit: utils.bigNumberify(5000000),
    gasPrice: overrides.gasPrice ? utils.bigNumberify(overrides.gasPrice) : undefined,
    nonce: overrides.nonce ? utils.bigNumberify(overrides.nonce) : undefined,
  };
  const contractAddress = await deployContractAndWait(wallet, beta2.WalletContract as any, [], transactionOverrides);
  console.log(`Wallet master contract address: ${contractAddress}`);
}
