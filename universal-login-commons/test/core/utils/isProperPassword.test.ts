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
    expect(isProperPassword('not$o$hort1')).be.eq(false);
  });

  it('Not enought specials', () => {
    expect(isProperPassword('notSoShort1')).be.eq(false);
  });

  it('Not enought digits', () => {
    expect(isProperPassword('not$o$hort')).be.eq(false);
  });
});
