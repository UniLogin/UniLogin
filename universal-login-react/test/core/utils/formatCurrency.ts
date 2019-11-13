import {expect} from 'chai';
import {formatCurrency, formatCurrencyWithTilda} from '../../../src/core/utils/formatCurrency';

describe('UNIT: formatCurrency', () => {
  it('Empty', () => {
    expect(formatCurrency('')).to.eq('$0.00');
  });

  it('Zero', () => {
    expect(formatCurrency('0')).to.eq('$0.00');
  });

  it('Always round down', () => {
    expect(formatCurrency('123.409')).to.eq('$123.40');
    expect(formatCurrency('123.405')).to.eq('$123.40');
    expect(formatCurrency('123.404')).to.eq('$123.40');
    expect(formatCurrency('123.401')).to.eq('$123.40');
  });

  it('Without currency symbol', () => {
    expect(formatCurrency('123.4567', '')).to.eq('123.45');
  });
});

describe('UNIT: formatCurrencyWithTilda', () => {
  it('Empty', () => {
    expect(formatCurrencyWithTilda('')).to.eq('$0.00');
  });

  it('Zero', () => {
    expect(formatCurrencyWithTilda('0')).to.eq('$0.00');
  });

  it('add tilda to non-zero value', () => {
    expect(formatCurrencyWithTilda('123.409')).to.eq('~ $123.40');
    expect(formatCurrencyWithTilda('123.405')).to.eq('~ $123.40');
    expect(formatCurrencyWithTilda('123.404')).to.eq('~ $123.40');
    expect(formatCurrencyWithTilda('123.401')).to.eq('~ $123.40');
  });

  it('add tilda to non-zero value with no currency', () => {
    expect(formatCurrencyWithTilda('123.4567', '')).to.eq('~ 123.45');
  });
});
