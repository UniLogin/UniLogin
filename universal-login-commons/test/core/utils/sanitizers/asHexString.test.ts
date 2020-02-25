import {cast} from '@restless/sanitizers';
import {asHexString} from '../../../../src';
import {expect} from 'chai';

describe('asHexString', () => {
  it('Works for proper hash', () => {
    const input = '0xa4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854e';
    const output = cast(input, asHexString(66));
    expect(output).to.deep.eq(input);
  });

  it('Requires 0x prefix', () => {
    const input = 'a4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854e';
    expect(() => cast(input, asHexString(66))).to.throw;
    expect(() => cast(input, asHexString(64))).to.throw;
  });

  it('Fails if too short', () => {
    const input = '0xa4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854';
    expect(() => cast(input, asHexString(66))).to.throw;
  });

  it('Fails if too long', () => {
    const input = '0xa4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854ee';
    expect(() => cast(input, asHexString(66))).to.throw;
  });

  it('Fails if not a hex', () => {
    const input = '0xa4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854X';
    expect(() => cast(input, asHexString(66))).to.throw;
  });
});
