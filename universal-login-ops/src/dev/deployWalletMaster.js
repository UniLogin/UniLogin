import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import {getContractHash} from '@universal-login/commons';
import {deployWalletMasterWithRefund} from '@universal-login/contracts';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployWalletMasterWithRefund(deployWallet);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMasterWithRefund);
  console.log(`WalletMaster hash: ${masterContractHash}`);
  return {address, masterContractHash};
}
