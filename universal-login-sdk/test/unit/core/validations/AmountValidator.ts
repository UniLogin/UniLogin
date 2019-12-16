import {TransferDetails} from '@universal-login/commons';
import {utils} from 'ethers';
import {expect} from 'chai';
import {AmountValidator} from '../../../../lib/core/services/validations/AmountValidator';

const TEST_TRANSFER_DETAILS: TransferDetails = {
  to: '0x',
  amount: '',
  transferToken: '0x1',
  gasParameters: {
    gasToken: '0x',
    gasPrice: utils.parseUnits('1', 'gwei'),
  },
};

describe('UNIT: AmountValidator', () => {

  it('proper balance', () => {
    const result = new AmountValidator('10').validate({...TEST_TRANSFER_DETAILS, amount: '1'}, {amount: []});
    expect(result).to.deep.eq([]);
  });

  it('negative amount', () => {
    const result = new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '-1'}, {amount: []});
    expect(result).to.deep.eq(['Amount -1 is not a valid number']);
  });

  it('amount as word', () => {
    const result = new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: 'test'}, {amount: []});
    expect(result).to.deep.eq(['Amount test is not a valid number']);
  });

  it('balance too low', () => {
    const result = new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '10'}, {amount: []});
    expect(result).to.deep.eq(['Insufficient funds. Sending 10.0 eth, got only 1.0 eth']);
  });

  it('balance too low with fee', () => {
    const result = new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, transferToken: '0x', amount: '1'}, {amount: []});
    expect(result).to.deep.eq(['Insufficient funds. Sending 1.0 eth, got only 1.0 eth + 0.0002 eth fee']);
  });
});
