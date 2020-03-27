import {Wallet, utils} from 'ethers';
import {TransactionOverrides, deployContract} from '@unilogin/commons';
import {DefaultCallbackHandler, GnosisSafe, ProxyFactory} from './contracts';

export const deployGnosisSafe = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, GnosisSafe, [], {gasLimit: utils.bigNumberify('6500000'), ...overrideOptions});
};

export const deployProxyFactory = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, ProxyFactory, [], overrideOptions);
};

export const deployDefaultCallbackHandler = (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, DefaultCallbackHandler, [], overrideOptions);
};
