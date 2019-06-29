import {Wallet, ContractFactory} from 'ethers';
import {TransactionOverrides, ContractJSON} from '@universal-login/commons';
import {getDeployData} from './encode';
import ProxyContract from '../build/KitsuneProxy.json';
import ProxyCounterfactualFactory from '../build/ProxyCounterfactualFactory.json';

export const deployFactory = async (wallet: Wallet, walletMasterAddress: string, overrideOptions?: TransactionOverrides) => {
  const initCode = getDeployData(ProxyContract as ContractJSON, [walletMasterAddress, '0x0']);
  const factory = new ContractFactory(
    ProxyCounterfactualFactory.abi,
    ProxyCounterfactualFactory.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(initCode, {...overrideOptions});
  await contract.deployed();
  return contract;
};
