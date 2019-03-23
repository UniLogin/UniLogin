import WalletMaster from 'universal-login-contracts/build/WalletMaster';
import {deployContract} from 'ethereum-waffle';

async function deployWalletMaster(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMaster);
  console.log(`WalletMaster address: ${address}`);
  return address;
}

module.exports = deployWalletMaster;
