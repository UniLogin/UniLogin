import {expect} from 'chai';
import {filterENSDomains, filterENSNames} from '../../src/app/filterENSDomains';

describe('filterENSDomains', () => {
  it('returns only valild domains if deprecated domain is present', () => {
    const deprecatedDomain = 'unilogin.eth';
    const validDomain = 'uniuni.eth';
    expect(filterENSDomains([deprecatedDomain, validDomain])).to.deep.eq([validDomain]);
  });

  it('returns the same array of domains if no deprecated domains', () => {
    const validDomain1 = 'uniuni.eth';
    const validDomain2 = 'unibeta.eth';
    const validDomain3 = 'unisomething.eth';
    expect(filterENSDomains([validDomain1, validDomain2, validDomain3])).to.deep.eq([validDomain1, validDomain2, validDomain3]);
  });
});

describe('filterENSNames', () => {
  it('returns ENS names only with valid ends', () => {
    const validName1 = 'jus.uniuni.eth';
    const validName2 = 'jus.unibeta.eth';
    const deprecatedName = 'jus.unilogin.eth';
    expect(filterENSNames([validName1, validName2, deprecatedName])).to.deep.eq([validName1, validName2]);
  });
});
