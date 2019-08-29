import WalletMasterWithRefund from '@universal-login/contracts/build/Wallet.json';
import {getContractHash} from '@universal-login/commons';
import {deployWalletContract} from '@universal-login/contracts';

export default async function deployWalletContract(deployWallet) {
  const {address} = await deployWalletContract(deployWallet);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMasterWithRefund);
  console.log(`WalletMaster hash: ${masterContractHash}`);
  return {address, masterContractHash};
}
