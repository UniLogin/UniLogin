import ERC1077MasterCopy from '../contracts/ERC1077MasterCopy.json';
import {deployContract} from 'ethereum-waffle';
import {utils} from 'ethers';

async function deployIdentityMasterCopy(deployWallet) {
  const {address} = await deployContract(deployWallet, ERC1077MasterCopy, [utils.formatBytes32String(0)]);
  console.log(`IdentityMasterCopy contract address: ${address}`);
  return address;
}

module.exports = deployIdentityMasterCopy;
