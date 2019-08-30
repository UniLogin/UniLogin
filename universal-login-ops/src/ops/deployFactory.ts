import {Wallet, providers} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/WalletProxyFactory.json';
import {connect} from '../cli/connectAndExecute';

export type ConnectAndDeployFactory = {
  nodeUrl: string;
  privateKey: string;
  walletContractAddress: string;
  provider?: providers.Provider;
};

export async function connectAndDeployFactory({nodeUrl, privateKey, provider, walletContractAddress}: ConnectAndDeployFactory) {
  const {wallet} = connect(nodeUrl, privateKey, provider);
  await deployFactory(wallet, walletContractAddress);
}

export default async function deployFactory(wallet: Wallet, walletContractAddress: string): Promise<string> {
  console.log('Deploying factory contract...');
  const contractAddress = await deployContractAndWait(wallet, Factory, [walletContractAddress]);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
