import {Wallet, providers, utils} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import {beta2, gnosisSafe} from '@universal-login/contracts';
import {connect} from '../cli/connectAndExecute';

export type ConnectAndDeployFactoryBase = {
  nodeUrl: string;
  privateKey: string;
  provider?: providers.Provider;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};

export interface ConnectAndDeployFactory extends ConnectAndDeployFactoryBase {
  walletContractAddress: string;
};

export async function connectAndDeployFactory(argv: ConnectAndDeployFactory) {
  const {wallet} = connect(argv.nodeUrl, argv.privateKey, argv.provider);
  await deployFactory(wallet, argv);
}

export default async function deployFactory(wallet: Wallet, {nonce, gasPrice, walletContractAddress}: ConnectAndDeployFactory): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = {
    gasPrice: gasPrice && utils.bigNumberify(gasPrice),
    nonce: nonce && utils.bigNumberify(nonce),
  };
  const contractAddress = await deployContractAndWait(wallet, beta2.WalletProxyFactory, [walletContractAddress], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}

export async function deployFactoryGnosis(wallet: Wallet, givenTransactionOverrides: ConnectAndDeployFactoryBase): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = {
    gasPrice: givenTransactionOverrides.gasPrice && utils.bigNumberify(givenTransactionOverrides.gasPrice),
    nonce: givenTransactionOverrides.nonce && utils.bigNumberify(givenTransactionOverrides.nonce),
  };
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ProxyFactory, [], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
