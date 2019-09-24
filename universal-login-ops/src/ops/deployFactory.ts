import {Wallet, providers, utils} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import Factory from '@universal-login/contracts/build/WalletProxyFactory.json';
import {connect} from '../cli/connectAndExecute';


export type ConnectAndDeployFactory = {
  nodeUrl: string;
  privateKey: string;
  walletContractAddress: string;
  provider?: providers.Provider;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};

export async function connectAndDeployFactory(argv: ConnectAndDeployFactory) {
  const {wallet} = connect(argv.nodeUrl, argv.privateKey, argv.provider);
  await deployFactory(wallet, argv);
}

export default async function deployFactory(wallet: Wallet, {nonce, gasPrice, walletContractAddress}: ConnectAndDeployFactory): Promise<string> {
  console.log('Deploying factory contract...');
  const transactionOverrides = {
    gasPrice: gasPrice && utils.bigNumberify(gasPrice),
    nonce: nonce && utils.bigNumberify(nonce)
  };
  const contractAddress = await deployContractAndWait(wallet, Factory, [walletContractAddress], transactionOverrides);
  console.log(`Factory contract address: ${contractAddress}`);
  return contractAddress;
}
