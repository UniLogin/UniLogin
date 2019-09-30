import {expect} from 'chai';
import {safeMultiply} from '../../../lib/core/utils/safeMultiply';
import {utils} from 'ethers';

describe('safeMultiply', () => {
  it('111.11 USD/ETH * 2 ETH = 222.22 USD', () => {
    const actualEthTotalWorth = safeMultiply(utils.parseEther('2'), 111.11);

    expect(actualEthTotalWorth).to.be.equal('222.22');
  });

  it('111.11 USD/ETH * 0 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiply(utils.parseEther('0'), 111.11);

    expect(actualEthTotalWorth).to.be.equal('0.0');
  });

  it('0 USD/ETH * 2 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiply(utils.parseEther('2'), 0);

    expect(actualEthTotalWorth).to.be.equal('0.0');
  });
});
