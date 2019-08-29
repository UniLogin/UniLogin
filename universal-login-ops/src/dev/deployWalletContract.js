import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {getContractHash} from '@universal-login/commons';
import {deployWalletContract} from '@universal-login/contracts';

export default async function deployWalletContract(deployWallet) {
  const {address} = await deployWalletContract(deployWallet);
  console.log(`WalletContract address: ${address}`);
  const walletContractHash = getContractHash(WalletContract);
  console.log(`WalletContract hash: ${walletContractHash}`);
  return {address, walletContractHash};
}
