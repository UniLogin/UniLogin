import {expect} from 'chai';
import {getNameFromEmail} from '../../../src/core/utils/getNameFromEmail';

describe('UNIT: getNameFromEmail', () => {
  const itGetsNameFromEmail = (email: string, name: string) =>
    it(`returns ${name} for ${email}`, () => {
      expect(getNameFromEmail(email)).to.deep.eq(name);
    });

  itGetsNameFromEmail('justyna@gmail.com', 'Justyna');
  itGetsNameFromEmail('justyna12345@gmail.com', 'Justyna12345');
  itGetsNameFromEmail('justyna-12345@gmail.com', 'Justyna-12345');
  itGetsNameFromEmail('justyna.12345@gmail.com', 'Justyna.12345');
  itGetsNameFromEmail('justyna.justyna@gmail.com', 'Justyna.Justyna');
  itGetsNameFromEmail('justyna.justyna@gmail.com', 'Justyna.Justyna');
  itGetsNameFromEmail('X Æ A-12@gmail.com', 'X Æ A-12');
});
