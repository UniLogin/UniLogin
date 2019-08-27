import {Wallet, utils} from 'ethers';
import {TransactionOverrides, deployContract} from '@universal-login/commons';
import WalletMaster from '../build/WalletMaster.json';


export const deployWalletMaster = async (wallet: Wallet, overrideOptions?: TransactionOverrides) => {
  return deployContract(wallet, WalletMaster, [], {gasLimit: utils.bigNumberify('5000000'), ...overrideOptions});
};
