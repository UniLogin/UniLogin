import {TransferDetails} from '@unilogin/commons';
import {utils} from 'ethers';
import {expect} from 'chai';
import {AmountValidator} from '../../../../src/core/services/validations/AmountValidator';
import {TransferErrors} from '../../../../src';

const TEST_TRANSFER_DETAILS: TransferDetails = {
  to: '0x',
  amount: '',
  token: {
    address: '0x1',
    decimals: 18,
  },
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

  it('empty amount', async () => {
    const emptyAmountTransferDetails = {...TEST_TRANSFER_DETAILS, amount: null} as unknown as TransferDetails;
    await new AmountValidator('10').validate(emptyAmountTransferDetails, errors);
    expect(errors).to.deep.eq({amount: ['Empty amount'], to: []});
  });

  it('proper balance', async () => {
    await new AmountValidator('10').validate({...TEST_TRANSFER_DETAILS, amount: '1'}, errors);
    expect(errors).to.deep.eq({amount: [], to: []});
  });

  it('negative amount', async () => {
    await new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '-1'}, errors);
    expect(errors).to.deep.eq({amount: ['Amount -1 is not a valid number'], to: []});
  });

  it('amount as word', async () => {
    await new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: 'test'}, errors);
    expect(errors).to.deep.eq({amount: ['Amount test is not a valid number'], to: []});
  });

  it('balance too low', async () => {
    await new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, amount: '10'}, errors);
    expect(errors).to.deep.eq({amount: ['Insufficient funds. Sending 10.0 eth, got only 1.0 eth'], to: []});
  });

  it('balance too low with fee', async () => {
    await new AmountValidator('1').validate({...TEST_TRANSFER_DETAILS, token: {address: '0x', decimals: 18}, amount: '1'}, errors);
    expect(errors).to.deep.eq({amount: ['Insufficient funds. Sending 1.0 eth + 0.0002 eth fee, got only 1.0 eth'], to: []});
  });
});
