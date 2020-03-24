import {expect} from 'chai';
import {safeMultiplyAndFormatEther} from '../../../src/core/utils/safeMultiply';
import {utils} from 'ethers';

describe('safeMultiplyAndFormatEther', () => {
  it('111.11 USD/ETH * 2 ETH = 222.22 USD', () => {
    const actualEthTotalWorth = safeMultiplyAndFormatEther(utils.parseEther('2'), 111.11);

    expect(actualEthTotalWorth).to.eq('222.22');
  });

  it('111.11 USD/ETH * 0 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiplyAndFormatEther(utils.parseEther('0'), 111.11);

    expect(actualEthTotalWorth).to.eq('0.0');
  });

  it('0 USD/ETH * 2 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiplyAndFormatEther(utils.parseEther('2'), 0);

    expect(actualEthTotalWorth).to.eq('0.0');
  });
});
