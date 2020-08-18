import {utils, Wallet} from 'ethers';
import {DEV_DAI_ADDRESS} from '@unilogin/commons';
import {IERC20Interface} from '@unilogin/contracts';

export const sendDevDai = async (wallet: Wallet, to: string, value: utils.BigNumberish) => {
  const data = IERC20Interface.functions.transfer.encode([to, value]);
  await wallet.sendTransaction({to: DEV_DAI_ADDRESS, data});
};
