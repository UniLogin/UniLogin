import {Wallet, ContractFactory} from 'ethers';
import {TransactionOverrides} from '@universal-login/commons';
import WalletProxyFactory from '../build/WalletProxyFactory.json';

export const deployFactory = async (wallet: Wallet, walletContractAddress: string, overrideOptions?: TransactionOverrides) => {
  const factory = new ContractFactory(
    WalletProxyFactory.abi,
    WalletProxyFactory.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(walletContractAddress, {...overrideOptions});
  await contract.deployed();
  return contract;
};
