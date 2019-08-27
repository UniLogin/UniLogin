import {defaultDeployOptions} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/Proxy.json';
import WalletMaster from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import {ContractFactory, Contract} from 'ethers';
import {encodeInitializeWithENSData, deployWalletMasterWithRefund} from '@universal-login/contracts';

export default async function createWalletContract(wallet, ensService) {
  const walletMaster = await deployWalletMasterWithRefund(wallet);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const walletArgs = [wallet.address, ...ensService.argsFor('alex.mylogin.eth')];
  const initData = encodeInitializeWithENSData(walletArgs);
  const proxyArgs = [walletMaster.address, initData];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  return new Contract(proxyContract.address, WalletMaster.abi, wallet);
}
