import {Wallet, Contract, utils} from 'ethers';
import {deployContractAndWait, TransactionOverrides} from '@universal-login/commons';
import {gnosisSafe} from '@universal-login/contracts';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployENSRegistrar(wallet: Wallet, overrides?: CommandOverrides) {
  console.log('Deploying ENSRegistrar contract...');
  const transactionOverrides: TransactionOverrides = {
    gasLimit: utils.bigNumberify(5000000),
    gasPrice: overrides?.gasPrice ? utils.bigNumberify(overrides.gasPrice) : undefined,
    nonce: overrides?.nonce ? utils.bigNumberify(overrides.nonce) : undefined,
  };
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ENSRegistrar as any, [], transactionOverrides);
  console.log(`ENSRegistrar address: ${contractAddress}`);
  return new Contract(contractAddress, gnosisSafe.ENSRegistrar.interface as any, wallet.provider);
}
