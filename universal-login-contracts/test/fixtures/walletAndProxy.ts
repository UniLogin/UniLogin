import {utils, Contract, Wallet} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {createKeyPair, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import WalletContract from '../../dist/contracts/Wallet.json';
import Proxy from '../../dist/contracts/WalletProxy.json';
import MockToken from '../../dist/contracts/MockToken.json';
import MockContract from '../../dist/contracts/MockContract.json';
import {deployWalletContract} from '../../src';

const {parseEther} = utils;

export default async function walletAndProxy(provider: MockProvider, [, , , , , , , , , wallet]: Wallet []) {
  const keyPair = createKeyPair();
  const walletContractMaster = await deployWalletContract(wallet);
  const walletContractProxy = await deployContract(wallet, Proxy, [walletContractMaster.address]);
  const proxyAsWalletContract = new Contract(walletContractProxy.address, WalletContract.abi, wallet);
  await wallet.sendTransaction({to: walletContractProxy.address, value: parseEther('2.0')});
  await proxyAsWalletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await mockToken.transfer(walletContractProxy.address, parseEther('1.0'));
  return {
    provider,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    walletContractProxy,
    proxyAsWalletContract,
    mockToken,
    mockContract,
    wallet,
    walletContractMaster,
  };
}
