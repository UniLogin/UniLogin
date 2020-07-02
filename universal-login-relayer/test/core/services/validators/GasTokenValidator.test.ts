import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {TEST_TOKEN_ADDRESS, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, TEST_GAS_PRICE_CHEAP} from '@unilogin/commons';
import {getMockedGasPriceOracle} from '@unilogin/commons/testutils';
import {GasTokenValidator, calculateTolerancedValue} from '../../../../src/core/services/validators/GasTokenValidator';
import {parseEther, bigNumberify} from 'ethers/utils';
import {constants} from 'ethers';

chai.use(chaiAsPromised);

describe('UNIT: GasTokenValidator', () => {
  const validator = new GasTokenValidator(getMockedGasPriceOracle());

  const getGasPriceDetails = (tokenPriceInETH: string) => ({
    gasPrice: TEST_GAS_PRICE_CHEAP.toString(),
    gasToken: TEST_TOKEN_ADDRESS,
    tokenPriceInETH,
  });

  describe('bellow gasPrice from oracle with default gas option (1 * 16 gwei <= 20 gwei)', () => {
    const gasPriceDetails = getGasPriceDetails('1');

    it('throw when gasToken is less than minimum expected', async () => {
      await expect(validator.validate(gasPriceDetails, 0.1)).to.be.rejectedWith('Gas price is not enough');
    });

    it('fulfilled when tolerance allows', async () => {
      await expect(validator.validate(gasPriceDetails, 0.2)).to.be.fulfilled;
    });

    it('fulfilled when gas price option allows', async () => {
      const gasPriceDetails = getGasPriceDetails('1');
      await expect(validator.validate(gasPriceDetails, 0, 'cheap')).to.be.fulfilled;
    });

    it('reject without specified tolerance', async () => {
      await expect(validator.validate(gasPriceDetails)).to.be.rejectedWith('Gas price is not enough');
    });
  });

  describe('gasPrice === 0', () => {
    it('ether', async () => {
      const gasPriceDetails = {...getGasPriceDetails('1'), gasPrice: '0', gasToken: ETHER_NATIVE_TOKEN.address};
      await expect(validator.validate(gasPriceDetails)).to.be.fulfilled;
    });

    it('token', async () => {
      const gasPriceDetails = {...getGasPriceDetails('1'), gasPrice: '0'};
      await expect(validator.validate(gasPriceDetails)).to.be.rejectedWith('Gas price is not enough');
    });
  });

  it('eq gasPrice from oracle 20 gwei', async () => {
    const gasPriceDetails = {...getGasPriceDetails('1'), gasPrice: TEST_GAS_PRICE};
    await expect(validator.validate(gasPriceDetails, 0.1)).to.be.fulfilled;
    await expect(validator.validate(gasPriceDetails)).to.be.fulfilled;
  });

  it('under gasPrice from oracle (1.4 * 16 gwei  > 20 gwei)', async () => {
    const gasPriceDetails = getGasPriceDetails('1.4');
    await expect(validator.validate(gasPriceDetails, 0.1)).to.be.fulfilled;
    await expect(validator.validate(gasPriceDetails)).to.be.fulfilled;
  });

  it('fulfilled with big precision number', async () => {
    const gasPriceDetails = {...getGasPriceDetails('0.00530977'), gasPrice: '4331637716887'};
    await expect(validator.validate(gasPriceDetails, 0.1)).to.be.fulfilled;
  });
});

describe('UNIT: calculateTolerancedValue', () => {
  describe('1 eth', () => {
    it('0.1 tolerance', () => expect(calculateTolerancedValue(constants.WeiPerEther, 0)).to.eq(constants.WeiPerEther));
    it('0.1 tolerance', () => expect(calculateTolerancedValue(constants.WeiPerEther, 0.1)).to.eq(parseEther('0.9')));
    it('0.15 tolerance', () => expect(calculateTolerancedValue(constants.WeiPerEther, 0.15)).to.eq(parseEther('0.85')));
    it('0.5 tolerance', () => expect(calculateTolerancedValue(constants.WeiPerEther, 0.5)).to.eq(parseEther('0.5')));
    it('1 tolerance', () => expect(calculateTolerancedValue(constants.WeiPerEther, 1)).to.eq(parseEther('0')));
  });

  describe('10', () => {
    const ten = bigNumberify('10');
    it('0.1 tolerance', () => expect(calculateTolerancedValue(ten, 0)).to.eq(ten));
    it('0.1 tolerance', () => expect(calculateTolerancedValue(ten, 0.1)).to.eq(bigNumberify('9')));
    it('0.15 tolerance', () => expect(calculateTolerancedValue(ten, 0.15)).to.eq(bigNumberify('8')));
    it('0.5 tolerance', () => expect(calculateTolerancedValue(ten, 0.5)).to.eq(bigNumberify('5')));
    it('1 tolerance', () => expect(calculateTolerancedValue(ten, 1)).to.eq(bigNumberify('0')));
  });

  describe('invalid tolerance', () => {
    it('12 tolerance', () => expect(() => calculateTolerancedValue(parseEther('1'), 12)).to.throws('Tolerance should be between 0 and 1, but got: 12'));
    it('-0.1 tolerance', () => expect(() => calculateTolerancedValue(parseEther('1'), -0.1)).to.throws('Tolerance should be between 0 and 1, but got: -0.1'));
  });
});
