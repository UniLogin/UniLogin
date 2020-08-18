import {expect} from 'chai';
import sinon from 'sinon';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, TransferDetails} from '@unilogin/commons';
import {RecipientValidator} from '../../../../src/core/services/validations/RecipientValidator';
import {TransferErrors} from '../../../../src/core/services/validations/Validator';
import UniLoginSdk from '../../../../src';
import {AddressZero} from 'ethers/constants';

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

const sdk = {
  resolveName: sinon.stub().resolves('0x'),
} as unknown as UniLoginSdk;

describe('UNIT: RecipientValidator', () => {
  let errors: TransferErrors;

  beforeEach(() => {
    errors = {amount: [], to: []};
  });

  it('empty recipient', async () => {
    const emptyRecipientTransferDetails = {...TEST_TRANSFER_DETAILS, to: null} as unknown as TransferDetails;
    await new RecipientValidator(sdk).validate(emptyRecipientTransferDetails, errors);
    expect(errors).to.deep.eq({to: ['Empty recipient'], amount: []});
  });

  it('proper ens name', async () => {
    await new RecipientValidator(sdk).validate({...TEST_TRANSFER_DETAILS, to: 'test.mylogin.eth'}, errors);
    expect(errors).to.deep.eq({to: [], amount: []});
  });

  it('proper address', async () => {
    await new RecipientValidator(sdk).validate({...TEST_TRANSFER_DETAILS, to: TEST_ACCOUNT_ADDRESS}, errors);
    expect(errors).to.deep.eq({to: [], amount: []});
  });

  it('invalid address', async () => {
    await new RecipientValidator(sdk).validate({...TEST_TRANSFER_DETAILS, to: '0x123'}, errors);
    expect(errors).to.deep.eq({to: ['0x123 is not a valid address'], amount: []});
  });

  it('invalid ens name', async () => {
    const sdkWithNullResolveName = {
      resolveName: sinon.stub().resolves(null),
    } as unknown as UniLoginSdk;
    await new RecipientValidator(sdkWithNullResolveName).validate({...TEST_TRANSFER_DETAILS, to: 'test.mylogin.eth'}, errors);
    expect(errors).to.deep.eq({to: ['Can\'t resolve ENS address: test.mylogin.eth'], amount: []});
  });

  it('invalid ens name', async () => {
    const sdkWithNullResolveName = {
      resolveName: sinon.stub().resolves(AddressZero),
    } as unknown as UniLoginSdk;
    await new RecipientValidator(sdkWithNullResolveName).validate({...TEST_TRANSFER_DETAILS, to: 'test.mylogin.eth'}, errors);
    expect(errors).to.deep.eq({to: ['Can\'t resolve ENS address: test.mylogin.eth'], amount: []});
  });

  it('invalid ens name and address', async () => {
    await new RecipientValidator(sdk).validate({...TEST_TRANSFER_DETAILS, to: 'test'}, errors);
    expect(errors).to.deep.eq({to: ['test is not a valid address or ENS name'], amount: []});
  });
});
