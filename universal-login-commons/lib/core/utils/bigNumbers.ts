import {utils} from 'ethers';

export const normalizeBigNumber = (bignumber: utils.BigNumber) => {
  return utils.bigNumberify(bignumber.toString());
};
