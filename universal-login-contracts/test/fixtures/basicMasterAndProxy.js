import {deployContract} from 'ethereum-waffle';
import MockToken from '../../build/MockToken';
import MockWalletMaster from '../../build/MockWalletMaster';
import Proxy from '../../build/Proxy';
import {Contract} from 'ethers';

export default async function basicMasterAndProxy(provider, [, , , , , , , , , wallet]) {
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const identityMaster = await deployContract(wallet, MockWalletMaster);
  const identityProxy = await deployContract(wallet, Proxy, [identityMaster.address, []]);
  const mockToken = await deployContract(wallet, MockToken);
  const proxyAsIdentity = new Contract(identityProxy.address, MockWalletMaster.abi, wallet);
  return {provider, publicKey, privateKey, keyAsAddress, identityMaster, identityProxy, proxyAsIdentity, mockToken, wallet};
}
