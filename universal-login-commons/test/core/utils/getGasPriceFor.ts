import {expect} from 'chai';
import {getGasPriceFor} from '../../../lib/core/utils/getGasPriceFor';
import {TEST_GAS_MODES} from '../../../lib/core/constants/test';

describe('getGasPriceFor', () => {
  it('empty array', () => {
    expect(() => getGasPriceFor([], '', '')).to.throw(`Cannot read property 'gasOptions' of undefined`);
  });

  it('invalid mode name', () => {
    expect(() => getGasPriceFor(TEST_GAS_MODES, 'invalidModeName', TEST_GAS_MODES[0].gasOptions[0].token.address)).to.throw(`Cannot read property 'gasOptions' of undefined`);
  });

  it('invalid token address', () => {
    expect(() => getGasPriceFor(TEST_GAS_MODES, TEST_GAS_MODES[0].name, 'invalidTokenAddress')).to.throw(`Cannot read property 'gasPrice' of undefined`);
  });

  for (const gasMode of TEST_GAS_MODES) {
    for (const gasOption of gasMode.gasOptions) {
      it(`gasMode: ${gasMode.name}, gasToken: ${gasOption.token.address}`, () => {
        expect(getGasPriceFor(TEST_GAS_MODES, gasMode.name, gasOption.token.address)).to.be.eq(gasOption.gasPrice);
      });
    }
  }
});
