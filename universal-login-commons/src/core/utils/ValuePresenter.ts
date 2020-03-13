import {isNumber} from './isNumber';

export class ValuePresenter {
  static presentRoundedValue(value: string, roundFunc: (value: string, precision?: number) => string, precision?: number): string {
    if (!isNumber(value)) {
      return value;
    }
    return roundFunc(value, precision === undefined ? 3 : precision);
  }
}
