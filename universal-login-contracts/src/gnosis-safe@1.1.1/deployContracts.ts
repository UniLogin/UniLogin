import {Wallet, utils} from 'ethers';
import {TransactionOverrides, deployContract} from '@universal-login/commons';
import GnosisSafe from './contracts/GnosisSafe.json';
import ProxyFactory from './contracts/ProxyFactory.json';

export const deployGnosisSafe = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, GnosisSafe, [], {gasLimit: utils.bigNumberify('6500000'), ...overrideOptions});
};

export const deployProxyFactory = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, ProxyFactory, [], overrideOptions);
};
