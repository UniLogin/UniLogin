import {utils} from 'ethers';

export const convert10sGweiToWei = (value: number) => {
  return utils.parseUnits(value.toString(), 10);
};
