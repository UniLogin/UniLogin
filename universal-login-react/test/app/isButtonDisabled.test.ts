import {expect} from 'chai';
import {isConfirmPasswordButtonDisabled} from '../../src/app/isConfirmPasswordButtonDisabled';

describe('UNIT: isConfirmPasswordButtonDisabled', () => {
  const itIsConfirmPasswordButtonDisabled = (expected: boolean, password: string, passwordConfirmation: string) =>
    it(`Return ${expected} for '${password}' password and password confirmation '${passwordConfirmation}'`, () => {
      expect(isConfirmPasswordButtonDisabled(password, passwordConfirmation)).to.eq(expected);
    });

  itIsConfirmPasswordButtonDisabled(false, 'CorrectPassword', 'CorrectPassword');
  itIsConfirmPasswordButtonDisabled(true, 'CorrectPassword', 'IncorrectConfirmation');
  itIsConfirmPasswordButtonDisabled(true, 'CorrectPassword', '');
  itIsConfirmPasswordButtonDisabled(true, '', '');
});
