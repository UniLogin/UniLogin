import {utils} from 'ethers';
import {ensure} from './errors/ensure';

const SAFE_MULTIPLY_UNITS_NORMALIZE = 18;

export const safeMultiplyAndFormatEther = (valueInWei: utils.BigNumber, multiplier: utils.BigNumberish, decimals = 18) => {
  const normalizedMultiplier = utils.parseEther(multiplier.toString());
  const resultE18 = normalizedMultiplier.mul(valueInWei);
  return utils.formatUnits(resultE18, SAFE_MULTIPLY_UNITS_NORMALIZE + decimals);
};

export const safeMultiplyDecimalsAndFormatEther = (value: utils.BigNumberish, multiplier: utils.BigNumberish) => {
  const formattedValue = cutPrecisionForInteger(value.toString());
  return utils.formatEther(cutPrecision(safeMultiplyAndFormatEther(utils.parseEther(formattedValue), multiplier).toString()));
};

export const safeMultiply = (value: utils.BigNumber, multiplier: utils.BigNumberish) => {
  const normalizedMultiplier = utils.parseEther(multiplier.toString());
  const resultE18 = normalizedMultiplier.mul(value);
  const result = utils.formatEther(resultE18);
  return cutPrecisionForInteger(result);
};

const cutPrecisionForInteger = (value: string) => value.split('.')[1] === '0' ? cutPrecision(value) : value;

const cutPrecision = (value: string) => value.split('.')[0];

export const safeDivide = (valueInWei: utils.BigNumber, divider: utils.BigNumberish) => {
  const priceAsBigNumber = utils.parseEther(divider.toString());
  ensure(!priceAsBigNumber.eq(0), Error, 'Can not divide by 0');
  const gasPriceAsBigNumber = utils.parseEther(valueInWei.toString());
  return gasPriceAsBigNumber.div(priceAsBigNumber);
};
