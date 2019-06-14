import {Contract, providers} from 'ethers';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';

export const doGetInitCode = async (factoryAddress: string, provider: providers.Provider) => {
  const factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, provider);
  return factoryContract.initCode();
};
