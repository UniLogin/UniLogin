import {ContractFactory, Contract, utils} from 'ethers';
import {getWallets} from 'ethereum-waffle';
import {defaultDeployOptions, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, computeContractAddress} from '@universal-login/commons';
import WalletProxy from '@universal-login/contracts/build/WalletProxy.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {encodeInitializeData, deployWalletContract} from '@universal-login/contracts';

export default async function createWalletContract(wallet) {
  const walletContract = await deployWalletContract(wallet);
  const factory = new ContractFactory(
    WalletProxy.interface,
    `0x${WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const nextWalletNonce = utils.bigNumberify(await wallet.getTransactionCount()).add(1);
  const futureAddress = computeContractAddress(wallet.address, nextWalletNonce);
  await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
  const initData = encodeInitializeData([wallet.address, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address]);
  const proxyArgs = [walletContract.address];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  await wallet.sendTransaction({to: proxyContract.address, data: initData});
  return {
    proxy: new Contract(proxyContract.address, WalletContract.abi, wallet),
    master: walletContract
  };
}
