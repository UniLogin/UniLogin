import {expect} from 'chai';
import {safeMultiplyAndFormatEther, safeDivide} from '../../../src/core/utils/safeMultiply';
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

describe('safeDivide', () => {
  it('divide safetly gasPrice by token price M1', () => {
    const tokenPriceInETH = '0.00001427';
    const gasPriceInETH = utils.bigNumberify(20000000000);
    expect(safeDivide(gasPriceInETH, tokenPriceInETH).toString()).to.eq('1401541695865451');
  });

  it('divide safetly gasPrice by token price >1', () => {
    const tokenPriceInETH = '200';
    const gasPriceInETH = utils.bigNumberify(20000000000);
    expect(safeDivide(gasPriceInETH, tokenPriceInETH).toString()).to.eq('100000000');
  });

  it('works for 0', () => {
    expect(safeDivide(utils.bigNumberify(0), '1').toString()).to.eq('0');
  });

  it('throws error if trying divide by 0', () => {
    expect(() => safeDivide(utils.bigNumberify(1), '0')).to.throw('Can not divide by 0');
  });
});
