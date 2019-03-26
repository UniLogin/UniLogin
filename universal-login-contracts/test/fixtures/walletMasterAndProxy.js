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
  const walletContractMaster = await deployContract(wallet, ERC1077MasterCopy, [constants.AddressZero]);
  const walletContractProxy = await deployContract(wallet, ERC1077Proxy, [walletContractMaster.address, publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContractProxy.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContractProxy.address, parseEther('1.0'));
  const proxyAsIdentity = new Contract(walletContractProxy.address, ERC1077MasterCopy.abi, wallet);
  return {provider, publicKey, privateKey, keyAsAddress, walletContractMaster, walletContractProxy, proxyAsIdentity, mockToken, mockContract, wallet};
}
