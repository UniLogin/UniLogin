import {Wallet, providers} from 'ethers';
import {deployContractAndWait} from '@unilogin/commons';
import {beta2, gnosisSafe} from '@unilogin/contracts';
import {connectToEthereumNode, CommandOverrides} from '../cli/connectAndExecute';
import {getTransactionOverrides} from '../utils/getTransactionOverrides';

export type DeployGnosisFactoryArgs = {
  nodeUrl: string;
  privateKey: string;
  provider?: providers.Provider;
  gasPrice?: string;
  nonce?: string;
};

export interface DeployBeta2FactoryArgs extends DeployGnosisFactoryArgs {
  walletContractAddress: string;
};

export async function connectAndDeployBeta2Factory(argv: DeployBeta2FactoryArgs) {
  const {wallet} = connectToEthereumNode(argv.nodeUrl, argv.privateKey, argv.provider);
  await deployBeta2Factory(wallet, argv);
}

export default async function deployBeta2Factory(wallet: Wallet, overrides: DeployBeta2FactoryArgs): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = getTransactionOverrides(overrides);
  const contractAddress = await deployContractAndWait(wallet, beta2.WalletProxyFactory, [overrides.walletContractAddress], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}

export async function deployGnosisFactory(wallet: Wallet, givenTransactionOverrides: DeployGnosisFactoryArgs): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = getTransactionOverrides(givenTransactionOverrides as CommandOverrides);
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ProxyFactory, [], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
