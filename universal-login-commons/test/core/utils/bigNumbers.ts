import chai, {expect} from 'chai';
import {normalizeBigNumber} from '../../../lib/core/utils/bigNumbers';
import {BigNumber} from 'ethers/utils';
import {solidity} from 'ethereum-waffle';

chai.use(solidity);

describe('UNIT: BigNumber', () => {
  it('0x00', () => {
    const a = new BigNumber('0x00');
    const b = new BigNumber('0x0');

    const expected = normalizeBigNumber(b);

    expect(expected).to.be.equal(a);
  });
});
