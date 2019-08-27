import {utils, Contract, Wallet, providers} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {createKeyPair} from '@universal-login/commons';
import WalletMaster from '../../build/WalletMasterWithRefund.json';
import Proxy from '../../build/Proxy.json';
import MockToken from '../../build/MockToken.json';
import MockContract from '../../build/MockContract.json';
import {encodeInitializeData, deployWalletMasterWithRefund} from '../../lib';

const {parseEther} = utils;

export default async function walletMasterAndProxy(unusedProvider : providers.Provider, [, , , , , , , , , wallet] : Wallet []) {
  const keyPair = createKeyPair();
  const walletContractMaster = await deployWalletMasterWithRefund(wallet);
  const initData = encodeInitializeData(keyPair.publicKey);
  const walletContractProxy = await deployContract(wallet, Proxy, [walletContractMaster.address, initData]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContractProxy.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContractProxy.address, parseEther('1.0'));
  const proxyAsWalletContract = new Contract(walletContractProxy.address, WalletMaster.abi, wallet);
  return {
    provider: wallet.provider,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    walletContractProxy,
    proxyAsWalletContract,
    mockToken,
    mockContract,
    wallet
  };
}
