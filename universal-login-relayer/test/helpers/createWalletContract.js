import {defaultDeployOptions} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/Proxy.json';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {ContractFactory, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {encodeInitializeWithENSData} from '@universal-login/contracts';

export default async function createWalletContract(wallet, argsFor) {
  const walletMaster = await deployContract(wallet, WalletMaster);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const walletArgs = [wallet.address, ...argsFor('alex.mylogin.eth')];
  const initData = encodeInitializeWithENSData(walletArgs);
  const proxyArgs = [walletMaster.address, initData];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  return new Contract(proxyContract.address, WalletMaster.abi, wallet);
}
