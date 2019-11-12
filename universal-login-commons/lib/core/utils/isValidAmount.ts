import {utils} from 'ethers';

export const isValidAmount = (amount: string, balance: string): boolean => {
  if (amount.match(/(^[0-9]+(\.?[0-9])*$)/)) {
    const amountAsBigNumber = utils.bigNumberify(utils.parseEther(amount));
    return amountAsBigNumber.gt(0) && amountAsBigNumber.lt(utils.parseEther(balance));
  }
  return false;
};
