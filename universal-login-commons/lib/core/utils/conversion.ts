import {utils} from 'ethers';

export const convertTenthGweiToWei = (value: number) => {
  return utils.parseUnits(value.toString(), 8);
};
