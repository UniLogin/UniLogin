import {Wallet, ContractFactory} from 'ethers';
import {getDeployData} from './encode';
import ProxyContract from '../build/Proxy.json';
import ProxyCounterfactualFactory from '../build/ProxyCounterfactualFactory.json';

export const deployFactory = async (wallet: Wallet, walletMasterAddress: string, overrideOptions?: any) => {
  const initCode = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const factory = new ContractFactory(
    ProxyCounterfactualFactory.abi,
    ProxyCounterfactualFactory.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(initCode, {
    ...overrideOptions
  });
  await contract.deployed();
  return contract;
}