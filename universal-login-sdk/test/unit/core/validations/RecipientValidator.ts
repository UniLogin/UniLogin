import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, TransferDetails} from '@universal-login/commons';
import {RecipientValidator} from '../../../../lib/core/services/validations/RecipientValidator';
import {TransferErrors} from '../../../../lib/core/services/validations/Validator';

const TEST_TRANSFER_DETAILS: TransferDetails = {
  to: '0x',
  amount: '',
  transferToken: '0x1',
  gasParameters: {
    gasToken: '0x',
    gasPrice: utils.parseUnits('1', 'gwei'),
  },
};

describe('UNIT: RecipientValidator', () => {
  let errors: TransferErrors;

  beforeEach(() => {
    errors = {amount: [], to: []};
  });

  it('proper ens name', () => {
    new RecipientValidator().validate({...TEST_TRANSFER_DETAILS, to: 'test.mylogin.eth'}, errors);
    expect(errors).to.deep.eq({to: [], amount: []});
  });

  it('proper address', () => {
    new RecipientValidator().validate({...TEST_TRANSFER_DETAILS, to: TEST_ACCOUNT_ADDRESS}, errors);
    expect(errors).to.deep.eq({to: [], amount: []});
  });

  it('invalid address', () => {
    new RecipientValidator().validate({...TEST_TRANSFER_DETAILS, to: '0x123'}, errors);
    expect(errors).to.deep.eq({to: ['0x123 is not a valid address'], amount: []});
  });

  it('invalid ens name and address', () => {
    new RecipientValidator().validate({...TEST_TRANSFER_DETAILS, to: 'test'}, errors);
    expect(errors).to.deep.eq({to: ['test is not a valid address or ENS name'], amount: []});
  });
});
