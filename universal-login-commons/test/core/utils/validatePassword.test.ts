import {expect} from 'chai';
import {validatePassword} from '../../../src/core/utils/validatePassword';

describe('UNIT: validatePassword', () => {
  it('Should validate valid password', () => {
    expect(validatePassword('$uperPassword123')).be.eq(true);
  });

  it('Should not validate too short password', () => {
    expect(validatePassword('$Hort1')).be.eq(false);
  });

  it('Should not validate password with not enought capitals', () => {
    expect(validatePassword('not$o$hort1')).be.eq(false);
  });

  it('Should not validate password with not enought specials', () => {
    expect(validatePassword('notSoShort1')).be.eq(false);
  });

  it('Should not validate password with not enought digits', () => {
    expect(validatePassword('not$o$hort')).be.eq(false);
  });
});
