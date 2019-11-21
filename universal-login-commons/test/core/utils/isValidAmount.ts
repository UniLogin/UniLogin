import {expect} from 'chai';
import {isValidAmount} from '../../../lib/core/utils/isValidAmount';
import {Nullable} from '../../../lib/core/types/common';

describe('isValidAmount', () => {
  const itValidatesAmount = (balance: Nullable<string>, amount: string | undefined, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance}`, () => {
      expect(isValidAmount(balance, amount)).to.eq(result);
    });
  };

  itValidatesAmount('2', '1.0', true);
  itValidatesAmount('20', '10', true);
  itValidatesAmount('2.01', '2', true);
  itValidatesAmount('1', 'ABC', false);
  itValidatesAmount('1', '0', false);
  itValidatesAmount('1', '1a00.1', false);
  itValidatesAmount('1', '14$.9', false);
  itValidatesAmount('1', '100.', false);
  itValidatesAmount('1', '100', false);
  itValidatesAmount('99', '100', false);
  itValidatesAmount(null, '2', false);
  itValidatesAmount('1.0', undefined, false);
});
