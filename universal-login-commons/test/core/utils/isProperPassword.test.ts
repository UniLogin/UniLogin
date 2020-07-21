import {expect} from 'chai';
import {isProperPassword} from '../../../src/core/utils/isProperPassword';

describe('UNIT: isProperPassword', () => {
  it('Correct password', () => {
    expect(isProperPassword('$uperPassword123')).be.eq(true);
  });

  it('Too short password', () => {
    expect(isProperPassword('$Hort1')).be.eq(false);
  });

  it('Not enought capitals', () => {
    expect(isProperPassword('notsoshort1')).be.eq(false);
  });
});
