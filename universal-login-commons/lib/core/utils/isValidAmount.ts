import {utils} from 'ethers';

export const isValidAmount = (amount: string, balance: string): boolean => {
  if (!!amount.match(/(^[0-9]+(\.?[0-9])*$)/)) {
    const formattedAmount = utils.bigNumberify(utils.parseEther(amount));
    return formattedAmount.gt(0) && formattedAmount.lt(utils.parseEther(balance));
  }
  return false;
};
