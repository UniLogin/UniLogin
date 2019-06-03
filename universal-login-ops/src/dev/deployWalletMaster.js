import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {deployContract} from 'ethereum-waffle';
import getContractHash from '../common/contractHeplers';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMaster);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMaster);
  console.log(`WalletMaster hash: ${masterContractHash}`)
  return {address, masterContractHash};
}
