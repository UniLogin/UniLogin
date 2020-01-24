import {Wallet, providers, utils} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import {beta2, gnosisSafe} from '@universal-login/contracts';
import {connectToEthereumNode} from '../cli/connectAndExecute';

export type DeployGnosisFactoryArgs = {
  nodeUrl: string;
  privateKey: string;
  provider?: providers.Provider;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};

export interface DeployBeta2FactoryArgs extends DeployGnosisFactoryArgs {
  walletContractAddress: string;
};

export async function connectAndDeployBeta2Factory(argv: DeployBeta2FactoryArgs) {
  const {wallet} = connectToEthereumNode(argv.nodeUrl, argv.privateKey, argv.provider);
  await deployBeta2Factory(wallet, argv);
}

export default async function deployBeta2Factory(wallet: Wallet, {nonce, gasPrice, walletContractAddress}: DeployBeta2FactoryArgs): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = {
    gasPrice: gasPrice && utils.bigNumberify(gasPrice),
    nonce: nonce && utils.bigNumberify(nonce),
  };
  const contractAddress = await deployContractAndWait(wallet, beta2.WalletProxyFactory, [walletContractAddress], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}

export async function deployGnosisFactory(wallet: Wallet, givenTransactionOverrides: DeployGnosisFactoryArgs): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = {
    gasPrice: givenTransactionOverrides.gasPrice && utils.bigNumberify(givenTransactionOverrides.gasPrice),
    nonce: givenTransactionOverrides.nonce && utils.bigNumberify(givenTransactionOverrides.nonce),
  };
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ProxyFactory, [], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
