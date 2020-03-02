import {expect} from 'chai';
import {formatCryptoBalance} from '../../../src/core/utils/formatCryptoBalance';

describe('UNIT: formatCrypto', () => {
  const cases: [string, string][] = [
    ['0', '0.0'],
    ['1', '1.0'],
    ['0.1234567890', '0.123456789'],
    ['0.1234567894', '0.123456789'],
    ['0.1234567896', '0.123456789'],
    ['0.1234567895', '0.123456789'],
    ['0.1234567899', '0.123456789'],
    ['0.12345', '0.12345'],
  ];

  for (const [input, output] of cases) {
    it(`returns ${output} for ${input}`, () => {
      expect(formatCryptoBalance(input, 9)).to.eq(output);
    });
  }
});
