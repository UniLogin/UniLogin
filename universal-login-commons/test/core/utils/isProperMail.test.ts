import {isProperEmail} from '../../../src/core/utils/isProperEmail';
import {expect} from 'chai';

describe('UNIT: isProperMail', () => {
  it('Correct email', () => {
    expect(isProperEmail('valid@email.com')).be.eq(true);
  });

  describe('Incorrect emails', () => {
    const incorrectEmails = [
      'e@email',
      '@email',
      'somestring',
      'email@.com',
      'email@email.',
      'email@.',
      '@.',
      '@email.com',
      'email@email,com',
      '-email@email.com',
      '_email@email.com',
      '.email@email.com',
      'e mail@email.com',
    ];

    it('Empty email', () => {
      expect(isProperEmail('')).be.eq(false);
    });

    incorrectEmails.forEach((email) => {
      it(email, () => {
        expect(isProperEmail(email)).be.eq(false);
      });
    });
  });
});
