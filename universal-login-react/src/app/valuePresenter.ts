import {isStringANumber} from '@unilogin/commons';

export class ValuePresenter {
  static presentRoundedValue(value: string, roundFunc: (value: string, precision?: number) => string, precision?: number): string {
    if (value === '') {
      return '';
    } else if (!isStringANumber(value)) {
      return value;
    }
    return roundFunc(value, precision === undefined ? 3 : precision);
  }
}
