import {deployContract} from 'ethereum-waffle';
import MockToken from '../../build/MockToken.json';
import MockWalletMaster from '../../build/MockWalletMaster.json';
import Proxy from '../../build/KitsuneProxy.json';
import {Contract} from 'ethers';

export default async function basicMasterAndProxy(provider, [, , , , , , , , , wallet]) {
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const walletMaster = await deployContract(wallet, MockWalletMaster, [], {gasLimit: 5000000}); // Bad gas estimation by default
  const walletProxy = await deployContract(wallet, Proxy, [walletMaster.address, []]);
  const mockToken = await deployContract(wallet, MockToken);
  const proxyAsWallet = new Contract(walletProxy.address, MockWalletMaster.abi, wallet);
  return {provider, publicKey, privateKey, keyAsAddress, walletMaster, walletProxy, proxyAsWallet, mockToken, wallet};
}
