import {utils} from 'ethers';
import {Nullable} from '../types/common';

const isNumber = /^[0-9]+(\.[0-9]+)?$/;

export const isValidAmount = (tokenAddress: string, balance: Nullable<string>, gasToken: string, gasCostInWei: utils.BigNumber, amount?: string): boolean => {
  if (!balance) {
    return false;
  }
  const maxEtherAmount = utils.parseEther(balance).sub(gasCostInWei);
  if (tokenAddress === gasToken) {
    return isAmountInConstraints(maxEtherAmount, amount);
  }
  return isAmountInConstraints(utils.parseEther(balance), amount);
};

export const isAmountInConstraints = (balance: utils.BigNumber, amount?: string): boolean => {
  if (amount && amount.match(isNumber)) {
    const amountAsBigNumber = utils.parseEther(amount);
    return amountAsBigNumber.gt(0) && amountAsBigNumber.lte(balance);
  }
  return false;
};
