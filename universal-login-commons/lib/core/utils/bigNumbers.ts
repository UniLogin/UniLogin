import {utils} from 'ethers';

export const normalizeBigNumber = (bigNumber: utils.BigNumber) => {
  return utils.bigNumberify(bigNumber.toString());
};
