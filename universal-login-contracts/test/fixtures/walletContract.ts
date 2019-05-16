import {providers, Wallet, utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/test';

interface SetupInitializeArgs {
  key: string;
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
  name?: string;
  domain?: string;
}

async function setupInitializeArgs({key, ensAddress, registrarAddress, resolverAddress, name = 'name', domain = 'mylogin.eth'}: SetupInitializeArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [key, hashLabel, ensName, node, ensAddress, registrarAddress, resolverAddress];
  return args;
}

export async function walletContract(provider: providers.Provider, [wallet, walletOwner]: Wallet[]) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(wallet);
  const walletMaster = await deployContract(wallet, WalletMaster);
  const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
  const args = await setupInitializeArgs({key: walletOwner.address, ensAddress, registrarAddress, resolverAddress});
  const initData = new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode(args);
  const walletContract = await deployContract(wallet, ProxyContract, [walletMaster.address, initData]);
  return {
    walletContract,
    walletOwner,
    wallet,
    provider: providerWithENS
  };
}