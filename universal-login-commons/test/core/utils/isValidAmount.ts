import {expect} from 'chai';
import {isValidAmount} from '../../../lib/core/utils/isValidAmount';

describe('isValidAmount', () => {
  const itValidatesAmount = (result: boolean, balance: string | null, amount?: string) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance}`, () => {
      expect(isValidAmount(balance, amount)).to.eq(result);
    });
  };

  itValidatesAmount(true, '2', '1.0');
  itValidatesAmount(true, '20', '10');
  itValidatesAmount(true, '2.01', '2');
  itValidatesAmount(false, '1', 'ABC');
  itValidatesAmount(false, '1', '0');
  itValidatesAmount(false, '1', '1a00.1');
  itValidatesAmount(false, '1', '14$.9');
  itValidatesAmount(false, '1', '100.');
  itValidatesAmount(false, '1', '100');
  itValidatesAmount(false, '99', '100');
  itValidatesAmount(false, null, '2');
  itValidatesAmount(false, '1.0', undefined);
});
