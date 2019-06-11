import {Wallet, ContractFactory} from 'ethers';
import {defaultDeployOptions} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/Factory.json';

export default async function deployCounterfactualFactory(wallet: Wallet) {
  console.log('Deploying counterfactual factory...');
  const deployTransaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(Factory.abi, Factory.bytecode).getDeployTransaction(),
  };
  const {hash} = await wallet.sendTransaction(deployTransaction);
  console.log(`Transaction hash: ${hash}`);
  const {contractAddress} = await wallet.provider.waitForTransaction(hash!);
  console.log(`Counterfactual factory contract address: ${contractAddress}`);
  return {counterfactualHash: hash, counterfactualAddress: contractAddress};
}
