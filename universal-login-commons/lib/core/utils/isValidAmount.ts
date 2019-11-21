import {utils} from 'ethers';
import {Nullable} from '../types/common';

const isNumber = /(^[0-9]+(\.?[0-9])*$)/;

export const isValidAmount = (balance: Nullable<string>, amount?: string): boolean => {
  if (amount && balance) {
    if (amount.match(isNumber)) {
      const amountAsBigNumber = utils.bigNumberify(utils.parseEther(amount));
      return amountAsBigNumber.gt(0) && amountAsBigNumber.lt(utils.parseEther(balance));
    }
  }
  return false;
};
