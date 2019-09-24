import {expect} from 'chai';
import {getGasPriceFromGasModes} from '../../../lib/core/utils/getGasPriceFromGasModes';
import {TEST_GAS_MODES} from '../../../lib/core/constants/test';

describe('getTransactionGasPrice', () => {
  it('empty array', () => {
    expect(getGasPriceFromGasModes([], '', '')).to.be.undefined;
  });

  it('invalid mode name', () => {
    expect(getGasPriceFromGasModes(TEST_GAS_MODES, 'invalidModeName', TEST_GAS_MODES[0].gasOptions[0].token.address)).to.be.undefined;
  });

  it('invalid token address', () => {
    expect(getGasPriceFromGasModes(TEST_GAS_MODES, TEST_GAS_MODES[0].name, 'invalidTokenAddress')).to.be.undefined;
  });

  for (const gasMode of TEST_GAS_MODES) {
    for (const gasOption of gasMode.gasOptions) {
      it(`gasMode: ${gasMode.name}, gasToken: ${gasOption.token.address}`, () => {
        expect(getGasPriceFromGasModes(TEST_GAS_MODES, gasMode.name, gasOption.token.address)).to.be.eq(gasOption.gasPrice);
      });
    }
  }
});
