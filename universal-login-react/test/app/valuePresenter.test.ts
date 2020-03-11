import {expect} from 'chai';
import {ValueRounder} from '../../src/app/valueRounder';
import {ValuePresenter} from '../../src/app/valuePresenter';

describe('UNIT: valuePresenter', () => {
  it('Empty string', () => {
    expect(ValuePresenter.presentRoundedValue('', ValueRounder.floor)).to.eq('');
  });

  it('Floor 123.123', () => {
    expect(ValuePresenter.presentRoundedValue('123.123', ValueRounder.floor)).to.eq(ValueRounder.floor('123.123'));
  });

  it('Ceil 123.123', () => {
    expect(ValuePresenter.presentRoundedValue('123.123', ValueRounder.ceil)).to.eq(ValueRounder.ceil('123.123'));
  });

  it('String is not a number', () => {
    expect(ValuePresenter.presentRoundedValue('123.ab', ValueRounder.ceil)).to.eq('123.ab');
  });
});
