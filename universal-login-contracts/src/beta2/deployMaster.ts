import {Wallet, utils} from 'ethers';
import {TransactionOverrides, deployContract} from '@unilogin/commons';
import {WalletContract} from './contracts';

export const deployWalletContract = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, WalletContract, [], {gasLimit: utils.bigNumberify('5000000'), ...overrideOptions});
};
