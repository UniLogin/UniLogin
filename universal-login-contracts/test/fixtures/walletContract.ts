import {providers, Wallet, utils, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import WalletMasterWithRefund from '../../build/WalletMasterWithRefund.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS, createKeyPair, computeContractAddress} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/testutils';
import {deployFactory, getDeployData, createProxyDeployWithENSArgs} from '../../lib';
import MockToken from '../../build/MockToken.json';


export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const walletMaster = await deployContract(deployer, WalletMaster);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  const factoryContract = await deployFactory(deployer, walletMaster.address);
  return {
    ensDomainData: {
      ensAddress,
      registrarAddress,
      resolverAddress
    },
    walletMaster,
    provider: providerWithENS,
    deployer,
    factoryContract
  };
}

export async function setupMasterWithRefundAndFactory(deployer: Wallet) {
  const walletMaster = await deployContract(deployer, WalletMasterWithRefund);
  const factoryContract = await deployFactory(deployer, walletMaster.address);
  return {
    walletMaster,
    factoryContract
  };
}

export async function setupWalletContract(deployer: Wallet) {
  const {ensDomainData, walletMaster, provider, factoryContract} = await setupEnsAndMaster(deployer);
  const keyPair = createKeyPair();
  const [, initializeWithENS] = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address);
  const initData = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
  const computedContractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initData);
  await deployer.sendTransaction({to: computedContractAddress, value: utils.parseEther('10.0')});
  await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
  const walletContract = new Contract(computedContractAddress, WalletMaster.interface, provider);
  return {
    walletContract,
    keyPair,
    deployer,
    provider
  };
}

export async function walletContractWithTokenAndEther(deployer: Wallet) {
  const {provider, walletContract, keyPair} = await setupWalletContract(deployer);
  const mockToken = await deployContract(deployer, MockToken);
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  await deployer.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  return {
    provider,
    walletContract,
    keyPair,
    deployer,
    mockToken
  };
}

export function walletContractFixture(givenProvider: providers.Provider, [wallet]: Wallet[]) {
  return setupWalletContract(wallet);
}

export function ensAndMasterFixture(givenProvider: providers.Provider, [deployer]: Wallet[]) {
  return setupEnsAndMaster(deployer);
}

export function walletContractWithFundsFixture(givenProvider: providers.Provider, [wallet]: Wallet[]) {
  return walletContractWithTokenAndEther(wallet);
}
