import {Wallet, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';

export const mineBlock = async (wallet: Wallet) => {
  const {wait} = await wallet.sendTransaction({to: AddressZero, value: utils.bigNumberify('1')});
  return wait();
};
