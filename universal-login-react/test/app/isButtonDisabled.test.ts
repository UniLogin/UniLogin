import {expect} from 'chai';
import {isButtonDisabled} from '../../src/app/isButtonDisabled';

describe('UNIT: isButtonDisabled', () => {
  const itIsButtonDisabled = (expected: boolean, password?: string, passwordConfirmation?: string) =>
    it(`Return ${expected} for '${password}' password and password confirmation '${passwordConfirmation}'`, () => {
      expect(isButtonDisabled(password, passwordConfirmation)).to.eq(expected);
    });

  itIsButtonDisabled(false, 'CorrectPassword', 'CorrectPassword');
  itIsButtonDisabled(true, 'CorrectPassword', 'IncorrectConfirmation');
  itIsButtonDisabled(true, 'CorrectPassword');
  itIsButtonDisabled(true);
});
