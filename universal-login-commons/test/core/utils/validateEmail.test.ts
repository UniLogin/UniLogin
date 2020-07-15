import {validateEmail} from '../../../src/core/utils/validateEmail';
import {expect} from 'chai';

describe('UNIT: ValidateEmail', () => {
  it('Should validate valid email', () => {
    expect(validateEmail('valid@email.com')).be.eq(true);
  });

  describe('Should not validate invalid email', () => {
    const invalidEmails = [
      'e@email',
      '@email',
      'somestring',
      'email@.com',
      'email@email.',
      'email@.',
      '@.',
      '@email.com',
      'email@email,com',
    ];

    it('Empty email', () => {
      expect(validateEmail('')).be.eq(false);
    });

    invalidEmails.forEach((email) => {
      it(email, () => {
        expect(validateEmail(email)).be.eq(false);
      });
    });
  });
});
