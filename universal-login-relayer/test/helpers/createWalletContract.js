import {defaultDeployOptions} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/UpgradeabilityProxy.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {ContractFactory, Contract} from 'ethers';
import {encodeInitializeData, deployWalletContract} from '@universal-login/contracts';

export default async function createWalletContract(wallet) {
  const walletContract = await deployWalletContract(wallet);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const initData = encodeInitializeData(wallet.address);
  const proxyArgs = [walletContract.address];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  await wallet.sendTransaction({to: proxyContract.address, data: initData});
  return new Contract(proxyContract.address, WalletContract.abi, wallet);
}
