import {expect} from 'chai';
import {utils} from 'ethers';
import {getPriceInEther} from '../../../src/core/utils/getPriceInEther';

describe('getPriceInEther', () => {
  it('no decimal', () => {
    expect(getPriceInEther('1', '2')).to.deep.eq(utils.parseEther('0.5'));
  });

  it('one input with decimal', () => {
    expect(getPriceInEther('1.25', '2')).to.deep.eq(utils.parseEther('0.625'));
    expect(getPriceInEther('2', '1.25')).to.deep.eq(utils.parseEther('1.6'));
  });

  it('both input with decimal', () => {
    expect(getPriceInEther('1.5', '2.5')).to.deep.eq(utils.parseEther('0.6'));
    expect(getPriceInEther('2.25', '1.25')).to.deep.eq(utils.parseEther('1.8'));
  });
});
