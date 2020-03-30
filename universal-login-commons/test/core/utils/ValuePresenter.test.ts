import {expect} from 'chai';
import {ValueRounder, ValuePresenter} from '../../../src';

describe('UNIT: valuePresenter', () => {
  it('Empty string', () => {
    expect(ValuePresenter.presentRoundedValue('', ValueRounder.floor, 3)).to.eq('');
  });

  it('Floor 123.123', () => {
    expect(ValuePresenter.presentRoundedValue('123.123', ValueRounder.floor, 3)).to.eq(ValueRounder.floor('123.123'));
  });

  it('Ceil 123.123', () => {
    expect(ValuePresenter.presentRoundedValue('123.123', ValueRounder.ceil, 3)).to.eq(ValueRounder.ceil('123.123'));
  });

  it('String is not a number', () => {
    expect(ValuePresenter.presentRoundedValue('123.ab', ValueRounder.ceil, 3)).to.eq('123.ab');
  });
});
