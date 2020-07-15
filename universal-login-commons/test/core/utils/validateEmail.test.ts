import {validateEmail} from '../../../src/core/utils/validateEmail';
import {expect} from 'chai';

describe('UNIT: ValidateEmail', () => {
  it('Should validate valid email', () => {
    expect(validateEmail('valid@email.com')).be.eq(true);
  });

  it('Should not validate invalid email', () => {
    expect(validateEmail('e@email')).be.eq(false);
  });

  it('Should not validate another invalid email', () => {
    expect(validateEmail('@email.com')).be.eq(false);
  });
});
