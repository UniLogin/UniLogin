import {defaultDeployOptions, TEST_GAS_PRICE} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/Proxy.json';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {ContractFactory, Contract} from 'ethers';
import {encodeInitializeData, deployWalletMaster} from '@universal-login/contracts';

export default async function createWalletContract(wallet, ensService) {
  const walletMaster = await deployWalletMaster(wallet);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const walletArgs = wallet.address;
  const initData = encodeInitializeData(walletArgs);
  const proxyArgs = [walletMaster.address, initData];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  return new Contract(proxyContract.address, WalletMaster.abi, wallet);
}
