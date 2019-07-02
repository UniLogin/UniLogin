import {Wallet, providers} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {getDeployData} from '@universal-login/contracts';
import {connect} from '../cli/connectAndExecute';

export type ConnectAndDeployFactory = {
  nodeUrl: string;
  privateKey: string;
  walletMasterAddress: string;
  provider?: providers.Provider;
};

export async function connectAndDeployFactory({nodeUrl, privateKey, provider, walletMasterAddress}: ConnectAndDeployFactory) {
  const {wallet} = connect(nodeUrl, privateKey, provider);
  await deployFactory(wallet, walletMasterAddress);
}

export default async function deployFactory(wallet: Wallet, walletMasterAddress: string): Promise<string> {
  const initData = getDeployData(ProxyContract, [walletMasterAddress, '0x0']);
  console.log('Deploying factory contract...');
  const contractAddress = await deployContractAndWait(wallet, Factory, [initData]);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
