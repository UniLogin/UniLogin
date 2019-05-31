import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {deployContract} from 'ethereum-waffle';
import {utils} from 'ethers';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMaster);
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = utils.keccak256(`0x${WalletMaster.bytecode}`);
  console.log(`WalletMaster hash: ${masterContractHash}`)
  return {address, masterContractHash};
}
