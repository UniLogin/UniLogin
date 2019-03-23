import WalletMaster from '../contracts/WalletMaster.json';
import {deployContract} from 'ethereum-waffle';
import {utils} from 'ethers';

export async function deployWalletMasterCopy(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMaster, [utils.formatBytes32String(0)]);
  console.log(`WalletMasterCopy contract address: ${address}`);
  return address;
}
