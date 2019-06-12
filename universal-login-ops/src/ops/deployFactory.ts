import {Wallet, ContractFactory} from 'ethers';
import {defaultDeployOptions} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {getDeployData} from '@universal-login/contracts';


export default async function deployFactory(wallet: Wallet, walletMasterAddress: string): Promise<string> {
  const initData = getDeployData(ProxyContract, [walletMasterAddress, '0x0']);
  console.log('Deploying factory contract...');
  const deployTransaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(Factory.abi, Factory.bytecode).getDeployTransaction(initData),
  };
  const {hash} = await wallet.sendTransaction(deployTransaction);
  console.log(`Factory deployment transaction hash: ${hash}`);
  const {contractAddress} = await wallet.provider.waitForTransaction(hash!);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress!;
}
