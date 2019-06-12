import {Wallet, ContractFactory} from 'ethers';
import {defaultDeployOptions} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/Factory.json';

export default async function deployFactory(wallet: Wallet): Promise<string> {
  console.log('Deploying factory contract...');
  const deployTransaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(Factory.abi, Factory.bytecode).getDeployTransaction(),
  };
  const {hash} = await wallet.sendTransaction(deployTransaction);
  console.log(`Factory deployment transaction hash: ${hash}`);
  const {contractAddress} = await wallet.provider.waitForTransaction(hash!);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress!;
}
