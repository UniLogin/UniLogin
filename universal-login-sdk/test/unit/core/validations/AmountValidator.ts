import {TransferDetails} from '@universal-login/commons';
import {utils} from 'ethers';
import {expect} from 'chai';
import {AmountValidator} from '../../../../lib/core/services/validations/AmountValidator';
import {TransferErrors} from '../../../../lib';

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
  let errors: TransferErrors;

  beforeEach(() => {
    errors = {amount: [], to: []};
  });

  it('empty amount', () => {
    const emptyAmountTransferDetails = {...TEST_TRANSFER_DETAILS, amount: null} as unknown as TransferDetails;
    new AmountValidator('10').validate(emptyAmountTransferDetails, errors);
    expect(errors).to.deep.eq({amount: ['Empty amount'], to: []});
  });

  it('proper balance', () => {
    new AmountValidator('10').validate({...TEST_TRANSFER_DETAILS, amount: '1'}, errors);
    expect(errors).to.deep.eq({amount: [], to: []});
  });

  it('negative amount', () => {
    new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '-1'}, errors);
    expect(errors).to.deep.eq({amount: ['Amount -1 is not a valid number'], to: []});
  });

  it('amount as word', () => {
    new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: 'test'}, errors);
    expect(errors).to.deep.eq({amount: ['Amount test is not a valid number'], to: []});
  });

  it('balance too low', () => {
    new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '10'}, errors);
    expect(errors).to.deep.eq({amount: ['Insufficient funds. Sending 10.0 eth, got only 1.0 eth'], to: []});
  });

  it('balance too low with fee', () => {
    new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, transferToken: '0x', amount: '1'}, errors);
    expect(errors).to.deep.eq({amount: ['Insufficient funds. Sending 1.0 eth + 0.0002 eth fee, got only 1.0 eth'], to: []});
  });
});
