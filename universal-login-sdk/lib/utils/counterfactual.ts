import {Contract, providers} from 'ethers';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import {computeContractAddress, createKeyPair} from '@universal-login/commons';

export const getInitCode = async (factoryAddress: string, provider: providers.Provider) => {
  const factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, provider);
  return factoryContract.initCode();
};

export const createFutureWallet = async (factoryAddress: string, provider: providers.Provider) => {
  const {privateKey, publicKey} = createKeyPair();
  const futureContractAddress = computeContractAddress(factoryAddress, publicKey, await getInitCode(factoryAddress, provider));
  return [privateKey, futureContractAddress, publicKey];
};
