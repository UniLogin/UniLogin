import {providers, Wallet, utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS, createKeyPair} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/testutils';
import {encodeInitializeWithENSData} from '../../lib';

export type EnsDomainData = {
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
};

type SetupInitializeArgs = {
  key: string;
  ensAddress: string;
  name?: string;
  domain?: string;
};

export function setupInitializeArgs({key, ensAddress, name = 'name', domain = 'mylogin.eth'}: SetupInitializeArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const hashDomain = utils.namehash(domain);
  const args = [key, hashLabel, ensName, node, hashDomain, ensAddress];
  return args;
}

export function createProxyDeployWithENSArgs(publicKey: string, ensAddress: string, walletMasterAddress: string) {
  const walletArgs = setupInitializeArgs({key: publicKey, ensAddress});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress} = await deployENS(deployer);
  const walletMaster = await deployContract(deployer, WalletMaster);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  return {
    ensAddress,
    walletMaster,
    provider: providerWithENS,
    deployer
  };
}

async function deployProxy(deployer: Wallet, walletMasterAddress: string, ensAddress: string, publicKey: string) {
  const deployArgs = createProxyDeployWithENSArgs(publicKey, ensAddress, walletMasterAddress);
  const proxyContract = await deployContract(deployer, ProxyContract, deployArgs);
  return proxyContract;
}

export async function setupWalletContract(deployer: Wallet) {
  const keyPair = createKeyPair();
  const {ensAddress, walletMaster, provider} = await setupEnsAndMaster(deployer);
  const walletContract = await deployProxy(deployer, walletMaster.address, ensAddress, keyPair.publicKey);
  return {
    walletContract,
    keyPair,
    deployer,
    provider
  };
}

export function walletContractFixture(givenProvider: providers.Provider, [wallet]: Wallet[]) {
  return setupWalletContract(wallet);
}

export function ensAndMasterFixture(givenProvider: providers.Provider, [deployer]: Wallet[]) {
  return setupEnsAndMaster(deployer);
}
