import WalletMaster from '../../build/WalletMaster.json';
import Proxy from '../../build/Proxy.json';
import MockToken from '../../build/MockToken.json';
import MockContract from '../../build/MockContract.json';
import {deployContract} from 'ethereum-waffle';
import {utils, Contract, Wallet, providers} from 'ethers';
import {getInitData} from '../../lib';

const {parseEther} = utils;

export default async function walletMasterAndProxy(unusedProvider : providers.Provider, [, , , , , , , , , wallet] : Wallet []) {
  const ownerWallet = Wallet.createRandom();
  const walletContractMaster = await deployContract(wallet, WalletMaster);
  const initData = getInitData(ownerWallet.address);
  const walletContractProxy = await deployContract(wallet, Proxy, [walletContractMaster.address, initData]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContractProxy.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContractProxy.address, parseEther('1.0'));
  const proxyAsWalletContract = new Contract(walletContractProxy.address, WalletMaster.abi, wallet);
  return {
    provider: wallet.provider,
    publicKey: ownerWallet.address,
    privateKey: ownerWallet.privateKey,
    walletContractProxy,
    proxyAsWalletContract,
    mockToken,
    mockContract,
    wallet
  };
}
