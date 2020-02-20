import {getContractHash, deployContractAndWait} from '@unilogin/commons';
import {beta2, deployWalletContract, gnosisSafe} from '@unilogin/contracts';
import {Wallet, utils} from 'ethers';

type DeployedMasterConfig = {
  address: string;
  walletContractHash: string;
};

export default async function deployWalletContractOnDev(deployWallet: Wallet): Promise<DeployedMasterConfig> {
  const {address} = await deployWalletContract(deployWallet);
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(beta2.WalletContract);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
}

export async function deployGnosisSafe(deployWallet: Wallet): Promise<DeployedMasterConfig> {
  const address = await deployContractAndWait(deployWallet, gnosisSafe.GnosisSafe as any, [], {gasLimit: utils.bigNumberify('6500000')});
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(gnosisSafe.GnosisSafe as any);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
};
