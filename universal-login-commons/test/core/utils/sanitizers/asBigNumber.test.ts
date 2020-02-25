import {utils} from 'ethers';
import {cast} from '@restless/sanitizers';
import {asBigNumber} from '../../../../src/core/utils/sanitizers/asBigNumber';
import {expect} from 'chai';

describe('asBigNumber', () => {
  it('input to cast as BigNumber', () => {
    const expectedBigNumber = utils.bigNumberify('0');
    const bigNumber = cast(expectedBigNumber, asBigNumber);
    expect(bigNumber).to.eq(expectedBigNumber);
  });

  it('input to cast as string', () => {
    const expectedBigNumber = '0';
    const bigNumber = cast(expectedBigNumber, asBigNumber);
    expect(bigNumber).to.eq(expectedBigNumber);
  });

  it('input to cast as number', () => {
    const expectedBigNumber = 0;
    const bigNumber = cast(expectedBigNumber, asBigNumber);
    expect(bigNumber).to.eq(expectedBigNumber);
  });
});
