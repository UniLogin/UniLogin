import ERC1077MasterCopy from '../contracts/ERC1077MasterCopy.json';
import {deployContract} from 'ethereum-waffle';
import {utils} from 'ethers';

export async function deployWalletMasterCopy(deployWallet) {
  const {address} = await deployContract(deployWallet, ERC1077MasterCopy, [utils.formatBytes32String(0)]);
  console.log(`WalletMasterCopy contract address: ${address}`);
  return address;
}
