import {ContractFactory, Contract, utils, Wallet} from 'ethers';
import {defaultDeployOptions, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {encodeInitializeData, deployWalletContract, beta2} from '@unilogin/contracts';

export default async function createWalletContract(wallet: Wallet) {
  const walletContract = await deployWalletContract(wallet);
  const factory = new ContractFactory(
    beta2.WalletProxy.abi,
    `0x${beta2.WalletProxy.evm.bytecode.object}`,
    wallet,
  );
  const initData = encodeInitializeData([wallet.address, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address]);
  const proxyArgs = [walletContract.address];
  const proxyContract = await factory.deploy(...proxyArgs, defaultDeployOptions);
  await wallet.sendTransaction({to: proxyContract.address, value: utils.parseEther('1.0')});
  await wallet.sendTransaction({to: proxyContract.address, data: initData});
  return {
    proxy: new Contract(proxyContract.address, beta2.WalletContract.abi, wallet),
    master: walletContract,
  };
}
