import {Wallet, ContractFactory} from 'ethers';
import {TransactionOverrides} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../build/ProxyCounterfactualFactory.json';

export const deployFactory = async (wallet: Wallet, walletMasterAddress: string, overrideOptions?: TransactionOverrides) => {
  const factory = new ContractFactory(
    ProxyCounterfactualFactory.abi,
    ProxyCounterfactualFactory.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(walletMasterAddress, {...overrideOptions});
  await contract.deployed();
  return contract;
};
