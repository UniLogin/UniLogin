import ERC1077MasterCopy from '../../build/ERC1077MasterCopy.json';
import ERC1077Proxy from '../../build/ERC1077Proxy.json';
import MockToken from '../../build/MockToken.json';
import MockContract from '../../build/MockContract.json';
import {deployContract} from 'ethereum-waffle';
import {constants, utils, Contract, Wallet, providers} from 'ethers';

const {parseEther} = utils;

export default async function walletMasterAndProxy(unusedProvider : providers.Provider, [, , , , , , , , , wallet] : Wallet []) {
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
  const proxyAsWalletContract = new Contract(walletContractProxy.address, ERC1077MasterCopy.abi, wallet);
  return {provider, publicKey, privateKey, keyAsAddress, walletContractMaster, walletContractProxy, proxyAsWalletContract, mockToken, mockContract, wallet};
}
