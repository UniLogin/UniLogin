import {deployContract} from 'ethereum-waffle';
import MockToken from '../../build/MockToken';
import MockMasterCopy from '../../build/MockMasterCopy';
import MockProxy from '../../build/MockProxy';

export default async function basicMasterAndProxy(provider, [, , , , , , , , , wallet]) {
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const masterCopy = await deployContract(wallet, MockMasterCopy);
  const proxy = await deployContract(wallet, MockProxy, [masterCopy.address]);
  const mockToken = await deployContract(wallet, MockToken);
  return {provider, publicKey, privateKey, keyAsAddress, masterCopy, proxy, mockToken, wallet};
}
