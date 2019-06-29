import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {getContractHash} from '@universal-login/commons';
import {deployContract} from 'ethereum-waffle';

export default async function deployWalletMaster(deployWallet) {
  const {address} = await deployContract(deployWallet, WalletMaster, [], {gasLimit: 5000000}); // Bad gas estimation by default
  console.log(`WalletMaster address: ${address}`);
  const masterContractHash = getContractHash(WalletMaster);
  console.log(`WalletMaster hash: ${masterContractHash}`);
  return {address, masterContractHash};
}
