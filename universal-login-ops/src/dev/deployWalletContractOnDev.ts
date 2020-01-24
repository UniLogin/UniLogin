import {getContractHash, deployContractAndWait} from '@universal-login/commons';
import {beta2, deployWalletContract, gnosisSafe} from '@universal-login/contracts';
import {Wallet, utils} from 'ethers';

export default async function deployWalletContractOnDev(deployWallet: Wallet): Promise<{address: string, walletContractHash: string}> {
  const {address} = await deployWalletContract(deployWallet);
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(beta2.WalletContract);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
}

export async function deployGnosisSafe(deployWallet: Wallet): Promise<{address: string, walletContractHash: string}> {
  const address = await deployContractAndWait(deployWallet, gnosisSafe.GnosisSafe, [], {gasLimit: utils.bigNumberify('6500000')});
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(gnosisSafe.GnosisSafe as any);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
};
