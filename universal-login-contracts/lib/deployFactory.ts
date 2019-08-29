import {Wallet, ContractFactory} from 'ethers';
import {TransactionOverrides} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../build/ProxyCounterfactualFactory.json';

export const deployFactory = async (wallet: Wallet, walletContractAddress: string, overrideOptions?: TransactionOverrides) => {
  const factory = new ContractFactory(
    ProxyCounterfactualFactory.abi,
    ProxyCounterfactualFactory.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(walletContractAddress, {...overrideOptions});
  await contract.deployed();
  return contract;
};
