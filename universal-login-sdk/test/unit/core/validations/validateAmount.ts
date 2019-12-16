import {validateAmount} from '../../../../lib/core/services/validations/validateAmount';
import {TransferDetails} from '@universal-login/commons';
import {utils} from 'ethers';
import {expect} from 'chai';

const TEST_TRANSFER_DETAILS: TransferDetails = {
  to: '0x',
  amount: '',
  transferToken: '0x1',
  gasParameters: {
    gasToken: '0x',
    gasPrice: utils.parseUnits('1', 'gwei'),
  },
};

describe('UNIT: #validateAmount', () => {
  it('proper balance', () => {
    const result = validateAmount({...TEST_TRANSFER_DETAILS, amount: '1'}, '10');
    expect(result).to.deep.eq([]);
  });

  it('negative amount', () => {
    const result = validateAmount({...TEST_TRANSFER_DETAILS, amount: '-1'}, '1');
    expect(result).to.deep.eq(['Amount -1 is not a valid number']);
  });

  it('amount as word', () => {
    const result = validateAmount({...TEST_TRANSFER_DETAILS, amount: 'test'}, '1');
    expect(result).to.deep.eq(['Amount test is not a valid number']);
  });

  it('balance too low', () => {
    const result = validateAmount({...TEST_TRANSFER_DETAILS, amount: '10'}, '1');
    expect(result).to.deep.eq(['Insufficient funds. Sending 10.0 eth, got only 1.0 eth']);
  });

  it('balance too low with fee', () => {
    const result = validateAmount({...TEST_TRANSFER_DETAILS, transferToken: '0x', amount: '1'}, '1');
    expect(result).to.deep.eq(['Insufficient funds. Sending 1.0 eth, got only 1.0 eth + 0.0002 eth fee']);
  });
});
