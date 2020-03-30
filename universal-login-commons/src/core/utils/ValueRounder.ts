import {isNumber} from './isNumber';
import {ensure} from '../..';

export class ValueRounder {
  static ceil(value: string, precision = 4): string {
    ensure(isNumber(value), Error, 'String is not a number');
    const roundLimit = Math.pow(10, precision);
    return String(Math.ceil(Number.parseFloat(value!) * roundLimit) / roundLimit);
  }

  static floor(value: string, precision = 4): string {
    ensure(isNumber(value), Error, 'String is not a number');
    const roundLimit = Math.pow(10, precision);
    return String(Math.floor(Number.parseFloat(value!) * roundLimit) / roundLimit);
  }
};
