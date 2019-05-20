import {providers, Wallet, utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/test';
import {getInitWithENSData} from '../../lib';

interface SetupInitializeArgs {
  key: string;
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
  name?: string;
  domain?: string;
}

export function setupInitializeArgs({key, ensAddress, registrarAddress, resolverAddress, name = 'name', domain = 'mylogin.eth'}: SetupInitializeArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [key, hashLabel, ensName, node, ensAddress, registrarAddress, resolverAddress];
  return args;
}

export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const walletMaster = await deployContract(deployer, WalletMaster);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  return {
    ensAddress,
    resolverAddress,
    registrarAddress,
    walletMaster,
    provider: providerWithENS,
    deployer
  };
}

export async function setupWalletContract(deployer: Wallet, contractOwner: Wallet) {
  const {ensAddress, registrarAddress, resolverAddress, walletMaster, provider} = await setupEnsAndMaster(deployer);
  const args = setupInitializeArgs({key: contractOwner.address, ensAddress, registrarAddress, resolverAddress});
  const initData = getInitWithENSData(args);
  const walletContract = await deployContract(deployer, ProxyContract, [walletMaster.address, initData]);
  return {
    walletContract,
    contractOwner,
    deployer,
    provider
  };
}

export function walletContractFixture(givenProvider: providers.Provider, [wallet, wallet2]: Wallet[]) {
  return setupWalletContract(wallet, wallet2);
}

export function ensAndMasterFixture(givenProvider: providers.Provider, [deployer]: Wallet[]) {
  return setupEnsAndMaster(deployer);
}