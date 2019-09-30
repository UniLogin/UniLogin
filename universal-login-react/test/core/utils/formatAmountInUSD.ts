import {expect} from 'chai';
import {formatAmountInUSD} from '../../../src/core/utils/formatAmountInUSD';

describe('UNIT: Format amount in USD', () => {

  it('Should return formatted amount in USD, rounded up', () => {
    expect(formatAmountInUSD('123.4567')).to.eq('$123.46');
  });

  it('Should return formatted amount in USD, rounded down', () => {
    expect(formatAmountInUSD('456.123')).to.eq('$456.12');
  });

  it('Should return formatted amount in USD, without dolar symbol', () => {
    expect(formatAmountInUSD('123.4567', false)).to.eq('123.46');
  });
});
