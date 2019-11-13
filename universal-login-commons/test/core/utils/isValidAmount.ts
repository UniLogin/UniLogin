import {expect} from 'chai';
import {isValidAmount} from '../../../lib/core/utils/isValidAmount';

describe('isValidAmount', () => {
  const itValidatesAmount = (result: boolean, amount: string, balance: string) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance}`, () => {
      expect(isValidAmount(amount, balance)).to.eq(result);
    });
  };

  itValidatesAmount(true, '1.0', '2');
  itValidatesAmount(true, '10', '20');
  itValidatesAmount(true, '2', '2.01');
  itValidatesAmount(false, 'ABC', '1');
  itValidatesAmount(false, '0', '1');
  itValidatesAmount(false, '1a00.1', '1');
  itValidatesAmount(false, '14$.9', '1');
  itValidatesAmount(false, '100.', '1');
  itValidatesAmount(false, '100', '1');
  itValidatesAmount(false, '100', '99');
});
