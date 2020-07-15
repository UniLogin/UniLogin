import {expect} from 'chai';
import {isProperPassword} from '../../../src/core/utils/isProperPassword';

describe('UNIT: validatePassword', () => {
  it('Should validate valid password', () => {
    expect(isProperPassword('$uperPassword123')).be.eq(true);
  });

  it('Should not validate too short password', () => {
    expect(isProperPassword('$Hort1')).be.eq(false);
  });

  it('Should not validate password with not enought capitals', () => {
    expect(isProperPassword('not$o$hort1')).be.eq(false);
  });

  it('Should not validate password with not enought specials', () => {
    expect(isProperPassword('notSoShort1')).be.eq(false);
  });

  it('Should not validate password with not enought digits', () => {
    expect(isProperPassword('not$o$hort')).be.eq(false);
  });
});
