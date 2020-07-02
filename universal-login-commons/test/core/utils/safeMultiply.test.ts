import {expect} from 'chai';
import {safeMultiplyAndFormatEther, safeDivide, safeMultiply, safeMultiplyDecimalsAndFormatEther} from '../../../src/core/utils/safeMultiply';
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

describe('safeMultiplyDecimalsAndFormatEther', () => {
  it('111.11 USD/ETH * 2 ETH = 222.22 USD', () => {
    const actualEthTotalWorth = safeMultiplyDecimalsAndFormatEther('2', 111.11);

    expect(actualEthTotalWorth).to.eq(utils.formatEther('222'));
  });

  it('111.11 USD/ETH * 0 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiplyDecimalsAndFormatEther('0', 111.11);

    expect(actualEthTotalWorth).to.eq('0.0');
  });

  it('0 USD/ETH * 2.0 ETH = 0 USD', () => {
    const actualEthTotalWorth = safeMultiplyDecimalsAndFormatEther('2.0', 0);

    expect(actualEthTotalWorth).to.eq('0.0');
  });

  it('200 USD/ETH * 0.005 WEI = 1 e-18 USD', () => {
    const actualEthTotalWorth = safeMultiplyDecimalsAndFormatEther('0.005', 200);

    expect(actualEthTotalWorth).to.eq(utils.formatEther('1'));
  });
});

describe('safeMultiply', () => {
  it('111.11 * 2 ETH = 222.22 * e^18', () => {
    const result = safeMultiply(utils.parseEther('2'), 111.11);
    expect(result).to.eq('222220000000000000000');
  });

  it('111.11 * 2 = 222.22', () => {
    const result = safeMultiply(utils.bigNumberify('2'), 111.11);
    expect(result).to.eq('222.22');
  });

  it('111.11 * 0 = 0', () => {
    const result = safeMultiply(utils.bigNumberify('0'), 111.11);
    expect(result).to.eq('0');
  });

  it('0 * 2 = 0', () => {
    const result = safeMultiply(utils.bigNumberify('2'), 0);
    expect(result).to.eq('0');
  });

  it('2 * 2 = 4', () => {
    const result = safeMultiply(utils.bigNumberify('2'), 2);
    expect(result).to.eq('4');
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
