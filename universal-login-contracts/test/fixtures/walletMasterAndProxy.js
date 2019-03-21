import ERC1077MasterCopy from '../../build/ERC1077MasterCopy';
import ERC1077Proxy from '../../build/ERC1077Proxy';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import {deployContract} from 'ethereum-waffle';
import {constants, utils, Contract} from 'ethers';

const {parseEther} = utils;

export default async function walletMasterAndProxy(provider, [, , , , , , , , , wallet]) {
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const identityMaster = await deployContract(wallet, ERC1077MasterCopy, [constants.AddressZero]);
  const identityProxy = await deployContract(wallet, ERC1077Proxy, [identityMaster.address, publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: identityProxy.address, value: parseEther('2.0')});
  await mockToken.transfer(identityProxy.address, parseEther('1.0'));
  const proxyAsIdentity = new Contract(identityProxy.address, ERC1077MasterCopy.abi, wallet);
  return {provider, publicKey, privateKey, keyAsAddress, identityMaster, identityProxy, proxyAsIdentity, mockToken, mockContract, wallet};
}
