import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import {getContractHash} from '@universal-login/commons';
import {deployContract} from 'ethereum-waffle';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMasterWithRefund);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMasterWithRefund);
  console.log(`WalletMaster hash: ${masterContractHash}`);
  return {address, masterContractHash};
}
