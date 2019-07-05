import {providers, Wallet, utils, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import WalletMasterWithRefund from '../../build/WalletMasterWithRefund.json';
import {withENS, createKeyPair} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/testutils';
import {deployFactory, createFutureDeploymentWithRefund} from '../../lib';
import MockToken from '../../build/MockToken.json';


export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const {factoryContract, walletMaster} = await setupMasterWithRefundAndFactory(deployer);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
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
  const {initializeData, futureAddress} = createFutureDeploymentWithRefund({keyPair, walletMasterAddress: walletMaster.address, gasPrice: '1000000', ensDomainData, factoryContract, relayerAddress: deployer.address});
  await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('10.0')});
  await factoryContract.createContract(keyPair.publicKey, initializeData);
  const walletContract = new Contract(futureAddress, WalletMaster.interface, provider);
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
