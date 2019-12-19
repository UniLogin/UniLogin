import {utils, providers, Contract, Wallet} from 'ethers';
import RegistrarContract from '../../contracts/FIFSRegistrar.json';
import ENS from '../../contracts/ENS.json';
import PublicResolver from '../../contracts/PublicResolver.json';

export const withENS = (provider: providers.Web3Provider, ensAddress: string) => {
  const chainOptions = {name: 'ganache', ensAddress, chainId: 0} as utils.Network;
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

export const registerName = (name: string, wallet: Wallet, registrarAddress: string) => {
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const registrar = new Contract(registrarAddress, RegistrarContract.interface, wallet);
  return registrar.register(hashLabel, wallet.address);
};

export const setResolver = (node: string, wallet: Wallet, ensAddress: string, publicResolver: string) => {
  const ens = new Contract(ensAddress, ENS.interface as any, wallet);
  return ens.setResolver(node, publicResolver);
};

export const setAddress = (node: string, wallet: Wallet, publicResolver: string) => {
  const publicResolverContract = new Contract(publicResolver, PublicResolver.interface as any, wallet);
  return publicResolverContract.setAddr(node, wallet.address);
};
