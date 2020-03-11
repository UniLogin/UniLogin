import {isStringANumber} from '@unilogin/commons';

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
    const roundLimit = Math.pow(10, precision);
    return String(Math.floor(Number.parseFloat(value!) * roundLimit) / roundLimit);
  }
};
