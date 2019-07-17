import {expect} from 'chai';
import {isProperAddress} from '../../../lib/core/utils/isProperAddress';

describe('UNIT: isProperAddress', () => {
  it('proper address', () => {
    expect(isProperAddress('0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.true;
  });

  it('too short', () => {
    expect(isProperAddress('0xFFF')).to.be.false;
  });

  it('no prefix', () => {
    expect(isProperAddress('FFFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.false;
  });

  it('invalid charater', () => {
    expect(isProperAddress('0xXFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.false;
  });

  it('too long', () => {
    expect(isProperAddress('0xFFFFFe7d45c34110B34Ed269AD86248884E78C74534545')).to.be.false;
  });
});
