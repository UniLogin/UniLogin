import {Contract, providers, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import MockWalletMaster from '../../build/MockWalletMaster.json';
import ProxyContract from '../../build/Proxy.json';

export default async function basicMasterAndProxy(givenProvider: providers.Provider, [, , wallet]: Wallet[]) {
  const walletMaster = await deployContract(wallet, MockWalletMaster);
  const walletProxy = await deployContract(wallet, ProxyContract, [walletMaster.address, []]);
  const proxyAsWallet = new Contract(walletProxy.address, MockWalletMaster.abi, wallet);
  return {provider: givenProvider, walletMaster, walletProxy, proxyAsWallet, wallet};
}
