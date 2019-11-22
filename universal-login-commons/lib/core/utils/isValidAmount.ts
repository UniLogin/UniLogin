import {utils} from 'ethers';
import {Nullable} from '../types/common';
import {ETHER_NATIVE_TOKEN} from '../constants/constants';

const isNumber = /^[0-9]+(\.[0-9]+)?$/;

export const isValidAmount = (tokenAddress: string, balance: Nullable<string>, gasCostInWei: utils.BigNumber, amount?: string): boolean => {
  if (balance) {
    const maxEtherAmount = utils.parseEther(balance).sub(gasCostInWei);
    return tokenAddress === ETHER_NATIVE_TOKEN.address
      ? isAmountInConstraints(maxEtherAmount, amount)
      : isAmountInConstraints(utils.parseEther(balance), amount);
  }
  return false;
};

export const isAmountInConstraints = (balance: utils.BigNumber, amount?: string): boolean => {
  if (amount && amount.match(isNumber)) {
    const amountAsBigNumber = utils.parseEther(amount);
    return amountAsBigNumber.gt(0) && amountAsBigNumber.lte(balance);
  }
  return false;
};
