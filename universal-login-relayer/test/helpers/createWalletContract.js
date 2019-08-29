import {defaultDeployOptions} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/UpgradeabilityProxy.json';
import WalletMaster from '@universal-login/contracts/build/Wallet.json';
import {ContractFactory, Contract} from 'ethers';
import {encodeInitializeData, deployWalletMaster} from '@universal-login/contracts';

export default async function createWalletContract(wallet) {
  const walletMaster = await deployWalletMaster(wallet);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const initData = encodeInitializeData(wallet.address);
  const proxyArgs = [walletMaster.address];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  await wallet.sendTransaction({to: proxyContract.address, data: initData});
  return new Contract(proxyContract.address, WalletMaster.abi, wallet);
}
