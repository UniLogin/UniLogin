import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMaster.json';
import {getContractHash} from '@universal-login/commons';
import {deployWalletMaster} from '@universal-login/contracts';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployWalletMaster(deployWallet);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMasterWithRefund);
  console.log(`WalletMaster hash: ${masterContractHash}`);
  return {address, masterContractHash};
}
