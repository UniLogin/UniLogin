import {Contract, providers, Wallet} from 'ethers';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import {computeContractAddress} from '@universal-login/commons';

export const getInitCode = async (factoryAddress: string, provider: providers.Provider) => {
  const factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, provider);
  return factoryContract.initCode();
};

export const createFutureWallet = async (factoryAddress: string, provider: providers.Provider) => {
  const {address, privateKey} = Wallet.createRandom();
  const futureContractAddress = computeContractAddress(factoryAddress, address, await getInitCode(factoryAddress, provider));
  return [privateKey, futureContractAddress, address];
};
