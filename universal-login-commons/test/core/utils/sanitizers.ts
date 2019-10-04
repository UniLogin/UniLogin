import {expect} from 'chai';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import {cast} from '@restless/sanitizers';
import {asGasParameters} from '../../../lib/core/utils/sanitizers/asGasParameters';
import {asTransferDetails} from '../../../lib';
import {asBigNumber} from '../../../lib/core/utils/sanitizers/asBigNumber';

describe('sanitizers', () => {
  describe('asBigNumber', () => {
    it('input to cast as BigNumber', () => {
      const expectedBigNumber = utils.bigNumberify('0');
      const bigNumber = cast(expectedBigNumber, asBigNumber);
      expect(bigNumber).to.be.eq(expectedBigNumber);
    });

    it('input to cast as string', () => {
      const expectedBigNumber = '0';
      const bigNumber = cast(expectedBigNumber, asBigNumber);
      expect(bigNumber).to.be.eq(expectedBigNumber);
    });

    it('input to cast as number', () => {
      const expectedBigNumber = 0;
      const bigNumber = cast(expectedBigNumber, asBigNumber);
      expect(bigNumber).to.be.eq(expectedBigNumber);
    });
  });

  it('asGasParameters', () => {
    const expectedGasParameters = {
      gasPrice: utils.bigNumberify('1'),
      gasToken: ETHER_NATIVE_TOKEN.address
    };
    const gasParameters = cast(expectedGasParameters, asGasParameters);
    expect(gasParameters).to.deep.eq(expectedGasParameters);
  });

  it('asTransferDetails', () => {
    const expectedTransferDetails = {
      amount: '2',
      to: '0x43ECDb9cf0bd4345B009e8B279567e9B4F4631aF',
      transferToken: '0x0000000000000000000000000000000000000000',
      gasParameters: {
        gasPrice: utils.bigNumberify('2000000000'),
        gasToken: '0x0000000000000000000000000000000000000000'
      }
    };
    const transferDetails = cast(expectedTransferDetails, asTransferDetails);
    expect(transferDetails).to.deep.eq(expectedTransferDetails);
  });
});
