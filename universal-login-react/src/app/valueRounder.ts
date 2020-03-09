import {isStringANumber} from '@unilogin/commons';
import {utils} from 'ethers';

export class ValueRounder {

  static ceil(value: string, precision = 3): string {
    if (!isStringANumber(value)) {
      throw Error('String is not a number');
    }
    const roundLimit = Math.pow(10, precision);
    return String(Math.ceil(Number.parseFloat(value!) * roundLimit) / roundLimit);
  }

  static floor(value: string, precision = 3): string {
    if (!isStringANumber(value)) {
      throw Error('String is not a number');
    }
    const base = utils.bigNumberify(10).pow(precision > 18 ? 0 : 18-precision);
    return utils.formatEther(utils.parseEther(value).div(base).mul(base));
  }
};
