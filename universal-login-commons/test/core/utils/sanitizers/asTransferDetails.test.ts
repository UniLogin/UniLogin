import {utils} from 'ethers';
import {cast} from '@restless/sanitizers';
import {asTransferDetails} from '../../../../src';
import {expect} from 'chai';

it('asTransferDetails', () => {
  const expectedTransferDetails = {
    amount: '2',
    to: '0x43ECDb9cf0bd4345B009e8B279567e9B4F4631aF',
    token: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
    },
    gasParameters: {
      gasPrice: utils.bigNumberify('2000000000'),
      gasToken: '0x0000000000000000000000000000000000000000',
    },
  };
  const transferDetails = cast(expectedTransferDetails, asTransferDetails);
  expect(transferDetails).to.deep.eq(expectedTransferDetails);
});
