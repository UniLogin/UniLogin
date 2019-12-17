import {expect} from 'chai';
import sinon from 'sinon';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, TransferDetails} from '@universal-login/commons';
import {RecipientValidator} from '../../../../lib/core/services/validations/RecipientValidator';
import {TransferErrors} from '../../../../lib/core/services/validations/Validator';
import UniversalLoginSDK from '../../../../lib';

const TEST_TRANSFER_DETAILS: TransferDetails = {
  to: '0x',
  amount: '',
  transferToken: '0x1',
  gasParameters: {
    gasToken: '0x',
    gasPrice: utils.parseUnits('1', 'gwei'),
  },
};

const sdk = {
  resolveName: sinon.stub().resolves('0x'),
} as unknown as UniversalLoginSDK;

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
    } as unknown as UniversalLoginSDK;
    await new RecipientValidator(sdkWithNullResolveName).validate({...TEST_TRANSFER_DETAILS, to: 'test.mylogin.eth'}, errors);
    expect(errors).to.deep.eq({to: ['test.mylogin.eth is not a valid ENS name'], amount: []});
  });

  it('invalid ens name and address', async () => {
    await new RecipientValidator(sdk).validate({...TEST_TRANSFER_DETAILS, to: 'test'}, errors);
    expect(errors).to.deep.eq({to: ['test is not a valid address or ENS name'], amount: []});
  });
});
