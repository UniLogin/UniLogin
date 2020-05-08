import {utils} from 'ethers';
import {SAFE_MULTIPLY_UNITS_NORMALIZE} from '../constants/normalization';
import {ensure} from './errors/ensure';

export const safeMultiplyAndFormatEther = (valueInWei: utils.BigNumber, multiplier: utils.BigNumberish) => {
  const normalizedMultiplier = utils.parseEther(multiplier.toString());
  const resultE18 = normalizedMultiplier.mul(valueInWei);
  return utils.formatUnits(resultE18, SAFE_MULTIPLY_UNITS_NORMALIZE);
};

export const safeMultiply = (value: utils.BigNumber, multiplier: utils.BigNumberish) => {
  const normalizedMultiplier = utils.parseEther(multiplier.toString());
  const resultE18 = normalizedMultiplier.mul(value);
  const result = utils.formatEther(resultE18);
  return result.split('.')[1] === '0' ? result.split('.')[0] : result;
};

export const safeDivide = (valueInWei: utils.BigNumber, divider: utils.BigNumberish) => {
  const priceAsBigNumber = utils.parseEther(divider.toString());
  ensure(!priceAsBigNumber.eq(0), Error, 'Can not divide by 0');
  const gasPriceAsBigNumber = utils.parseEther(valueInWei.toString());
  return gasPriceAsBigNumber.div(priceAsBigNumber);
};
