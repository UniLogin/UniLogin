import {expect} from 'chai';
import {filterENSNames} from '../../src/app/filterENSNames';

describe('filterENSNames', () => {
  it('returns ENS names only with valid ends', () => {
    const validName1 = 'jus.uniuni.eth';
    const validName2 = 'jus.unibeta.eth';
    const deprecatedName = 'jus.unitest.eth';
    expect(filterENSNames([validName1, validName2, deprecatedName])).to.deep.eq([validName1, validName2]);
  });
});
