import {Wallet, utils} from 'ethers';
import {TransactionOverrides, deployContract} from '@universal-login/commons';
import WalletContract from '../build/Wallet.json';


export const deployWalletContract = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, WalletContract, [], {gasLimit: utils.bigNumberify('5000000'), ...overrideOptions});
};
