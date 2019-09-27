import {expect} from 'chai';
import {getGasPriceFor, findGasMode} from '../../../lib/core/utils/gasPriceMode';
import {TEST_GAS_MODES} from '../../../lib/core/constants/test';

describe('Helpers for GasMode ', () => {
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

  describe('findGasMode', () => {
    it('empty array', () => {
      expect(findGasMode([], '')).to.be.undefined;
    });

    it('invalid mode name', () => {
      expect(findGasMode(TEST_GAS_MODES, 'invalidModeName')).to.be.undefined;
    });

    for (const gasMode of TEST_GAS_MODES) {
      it(`gasMode: ${gasMode.name}`, () => {
        expect(findGasMode(TEST_GAS_MODES, gasMode.name)).to.be.eq(gasMode);
      });
    }
  });
});
