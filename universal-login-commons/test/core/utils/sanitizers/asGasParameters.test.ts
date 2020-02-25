import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../../../src';
import {cast} from '@restless/sanitizers';
import {asGasParameters} from '../../../../src/core/utils/sanitizers/asGasParameters';
import {expect} from 'chai';

it('asGasParameters', () => {
  const expectedGasParameters = {
    gasPrice: utils.bigNumberify('1'),
    gasToken: ETHER_NATIVE_TOKEN.address,
  };
  const gasParameters = cast(expectedGasParameters, asGasParameters);
  expect(gasParameters).to.deep.eq(expectedGasParameters);
});
