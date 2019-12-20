import {getContractHash} from '@universal-login/commons';
import {beta2, deployWalletContract} from '@universal-login/contracts';
import {Wallet} from 'ethers';

export default async function deployWalletContractOnDev(deployWallet: Wallet): Promise<{address: string, walletContractHash: string}> {
  const {address} = await deployWalletContract(deployWallet);
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(beta2.WalletContract);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
}
