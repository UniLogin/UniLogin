import {utils} from 'ethers';
import {SAFE_MULTIPLY_UNITS_DENORMALIZE, SAFE_MULTIPLY_UNITS_NORMALIZE} from '../constants/normalization';

export const safeMultiply = (balance: utils.BigNumber, price: utils.BigNumberish) => {
  const priceAsBigNumber = utils.parseUnits(price.toString(), SAFE_MULTIPLY_UNITS_DENORMALIZE);
  const multiplied = priceAsBigNumber.mul(balance);
  return utils.formatUnits(multiplied, SAFE_MULTIPLY_UNITS_NORMALIZE);
};
