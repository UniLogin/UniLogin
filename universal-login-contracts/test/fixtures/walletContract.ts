import {providers, Wallet, utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/test';
import {getInitWithENSData} from '../../lib';

type EnsDomainData = {
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
}

interface SetupInitializeArgs {
  key: string;
  ensDomainData: EnsDomainData;
  name?: string;
  domain?: string;
}

export function setupInitializeArgs({key, ensDomainData, name = 'name', domain = 'mylogin.eth'}: SetupInitializeArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [key, hashLabel, ensName, node, ensDomainData.ensAddress, ensDomainData.registrarAddress, ensDomainData.resolverAddress];
  return args;
}

export function getDeployWithEnsArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string) {
  const walletArgs = setupInitializeArgs({key: publicKey, ensDomainData});
  const initData = getInitWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const walletMaster = await deployContract(deployer, WalletMaster);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  return {
    ensDomainData: {
      ensAddress,
      registrarAddress,
      resolverAddress
    },
    walletMaster,
    provider: providerWithENS,
    deployer
  };
}

async function deployProxy(deployer: Wallet, walletMasterAddress: string, ensDomainData: EnsDomainData, publicKey: string) {
  const deployArgs = getDeployWithEnsArgs(publicKey, ensDomainData, walletMasterAddress);
  const proxyContract = await deployContract(deployer, ProxyContract, deployArgs);
  return proxyContract;
}

export async function setupWalletContract(deployer: Wallet, contractOwner: Wallet) {
  const {ensDomainData, walletMaster, provider} = await setupEnsAndMaster(deployer);
  const walletContract = await deployProxy(deployer, walletMaster.address, ensDomainData, contractOwner.address);
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